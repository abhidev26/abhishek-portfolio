import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Loader2, Mail, MapPin, Phone, Send } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { PERSONAL, SECTIONS } from '../data/personal';
import { buildMailto, isEmailConfigured, sendContact } from '../lib/email';
import { toast } from '../lib/ui';
import { SectionHeading } from '../components/SectionHeading';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { Reveal } from '../components/Reveal';

type Status = 'idle' | 'loading' | 'success' | 'error' | 'unconfigured';
type Fields = { name: string; email: string; message: string };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(f: Fields): Partial<Fields> {
  const e: Partial<Fields> = {};
  if (!f.name.trim()) e.name = 'Please enter your name.';
  if (!f.email.trim()) e.email = 'Please enter your email address.';
  else if (!EMAIL_RE.test(f.email.trim())) e.email = 'Please enter a valid email address.';
  if (!f.message.trim()) e.message = 'Please write a message.';
  else if (f.message.trim().length < 10) e.message = 'Message should be at least 10 characters.';
  return e;
}

export function Contact() {
  const s = SECTIONS[6];
  const [f, setF] = useState<Fields>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Partial<Fields>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [errMsg, setErrMsg] = useState('');

  const set = (k: keyof Fields) => (e: { target: { value: string } }) => {
    const next = { ...f, [k]: e.target.value };
    setF(next);
    if (touched[k]) setErrors(validate(next));
  };
  const blur = (k: keyof Fields) => () => { setTouched((t) => ({ ...t, [k]: true })); setErrors(validate(f)); };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const v = validate(f);
    setErrors(v); setTouched({ name: true, email: true, message: true });
    if (Object.keys(v).length) { toast('error', 'Please fix the highlighted fields.'); return; }
    setStatus('loading');
    const r = await sendContact({ name: f.name.trim(), email: f.email.trim(), message: f.message.trim() });
    if (r.status === 'sent') { setStatus('success'); toast('success', 'Message sent! I will get back to you soon.'); setF({ name: '', email: '', message: '' }); setTouched({}); }
    else if (r.status === 'unconfigured') { setStatus('unconfigured'); toast('info', 'Development mode: EmailJS is not configured, so nothing was sent.'); }
    else { setStatus('error'); setErrMsg(r.error); toast('error', 'Could not send your message. Please try again or use email.'); }
  };

  const field = (k: keyof Fields, label: string, el: 'input' | 'textarea', type = 'text', ac?: string) => {
    const id = `contact-${k}`; const err = touched[k] ? errors[k] : undefined;
    const common = { id, name: k, value: f[k], onChange: set(k), onBlur: blur(k), 'aria-invalid': Boolean(err), 'aria-describedby': err ? `${id}-err` : undefined, className: 'input-field', required: true, autoComplete: ac, disabled: status === 'loading' } as const;
    return (
      <div>
        <label htmlFor={id} className="mb-2 block font-display text-sm font-medium text-slate-200">{label} <span aria-hidden="true" className="text-pink-400">*</span></label>
        {el === 'input' ? <input type={type} {...common} /> : <textarea rows={5} {...common} />}
        {err && <p id={`${id}-err`} role="alert" className="mt-1.5 text-xs text-rose-300">{err}</p>}
      </div>
    );
  };

  const info = [
    { Icon: Mail, label: 'Email', value: PERSONAL.email, href: `mailto:${PERSONAL.email}` },
    { Icon: Phone, label: 'Phone', value: PERSONAL.phone, href: PERSONAL.phoneHref },
    { Icon: MapPin, label: 'Location', value: PERSONAL.location },
  ];

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative flex min-h-[130svh] flex-col">
      <div className="section section-pad">
        <SectionHeading id="contact-title" code={s.code} planet={s.planet} title="Let's Connect" subtitle="Have an opportunity, a project idea or just want to say hello? Send a message from the edge of the solar system." />
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <GlassCard className="h-full space-y-5 p-6 sm:p-8">
              {info.map(({ Icon, label, value, href }) => (
                <div key={label} className="flex items-center gap-4">
                  <span className="grid h-12 w-12 flex-none place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10"><Icon className="h-5 w-5 text-cyan-300" aria-hidden="true" /></span>
                  <div className="min-w-0"><p className="mono-label !text-[10px]">{label}</p>
                    {href ? <a href={href} className="break-all font-display text-base hover:text-cyan-200">{value}</a> : <p className="font-display text-base">{value}</p>}</div>
                </div>
              ))}
              <div className="flex gap-3 pt-3">
                <a aria-label="GitHub" href={PERSONAL.github} target="_blank" rel="noreferrer noopener" className="glass grid h-11 w-11 place-items-center rounded-full hover:shadow-[0_0_24px_rgba(124,58,237,.6)]"><FaGithub /></a>
                <a aria-label="LinkedIn" href={PERSONAL.linkedin} target="_blank" rel="noreferrer noopener" className="glass grid h-11 w-11 place-items-center rounded-full hover:shadow-[0_0_24px_rgba(37,99,235,.6)]"><FaLinkedin /></a>
                <a aria-label="Email" href={`mailto:${PERSONAL.email}`} className="glass grid h-11 w-11 place-items-center rounded-full hover:shadow-[0_0_24px_rgba(236,72,153,.6)]"><Mail className="h-4 w-4" /></a>
              </div>
            </GlassCard>
          </Reveal>

          <Reveal delay={0.1}>
            <GlassCard border className="relative overflow-hidden p-6 sm:p-8">
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex min-h-[22rem] flex-col items-center justify-center text-center">
                    <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 14 }}><CheckCircle2 className="h-20 w-20 text-emerald-300 drop-shadow-[0_0_24px_rgba(52,211,153,.7)]" /></motion.div>
                    <h3 className="mt-5 font-display text-2xl font-bold">Message sent!</h3>
                    <p className="mt-2 text-slate-300">Thanks for reaching out — I'll reply as soon as I can.</p>
                    <GradientButton variant="ghost" size="sm" className="mt-6" onClick={() => setStatus('idle')}>Send another</GradientButton>
                  </motion.div>
                ) : (
                  <motion.form key="form" noValidate onSubmit={submit} exit={{ opacity: 0 }} className="space-y-5" aria-label="Contact form">
                    {field('name', 'Name', 'input', 'text', 'name')}
                    {field('email', 'Email', 'input', 'email', 'email')}
                    {field('message', 'Message', 'textarea')}
                    {status === 'unconfigured' && (
                      <div role="status" className="rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm text-amber-100">
                        <p className="flex items-center gap-2 font-semibold"><AlertTriangle className="h-4 w-4" />Development mode — message not sent</p>
                        <p className="mt-1 text-amber-100/80">EmailJS isn't configured yet (see <code className="font-mono">.env.example</code>). You can send it from your email app instead:</p>
                        <a href={buildMailto(f)} className="mt-3 inline-flex items-center gap-2 rounded-full bg-amber-200/90 px-4 py-2 font-display text-sm font-semibold text-black"><Mail className="h-4 w-4" />Open in email app</a>
                      </div>
                    )}
                    {status === 'error' && (
                      <div role="alert" className="rounded-2xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-100">
                        <p className="font-semibold">Something went wrong.</p><p className="mt-1 text-rose-100/80">{errMsg || 'The message could not be delivered.'}</p>
                        <a href={buildMailto(f)} className="mt-2 inline-block underline">Email me directly instead</a>
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-4">
                      <GradientButton type="submit" disabled={status === 'loading'} icon={status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}>{status === 'loading' ? 'Sending…' : 'Send Message'}</GradientButton>
                      {!isEmailConfigured && <span className="mono-label !text-[10px]">Dev mode · EmailJS not configured</span>}
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
