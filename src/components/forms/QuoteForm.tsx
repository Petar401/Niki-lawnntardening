import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button, Icon } from '@/components/primitives';
import { services } from '@/content/services';

const gardenSizes = [
  { value: 'small', label: 'Small (under 50 m²)' },
  { value: 'medium', label: 'Medium (50–200 m²)' },
  { value: 'large', label: 'Large (over 200 m²)' },
  { value: 'unsure', label: 'Not sure' },
] as const;

export function QuoteForm() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const toggleService = (id: string) =>
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );

  return (
    <form className="flex flex-col gap-5" noValidate>
      {/* honeypot — bots fill this; humans never see it */}
      <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label>
          Leave this field blank
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Your name" htmlFor="name">
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className={inputClass}
          />
        </Field>
        <Field label="Email" htmlFor="email">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={inputClass}
          />
        </Field>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Phone (optional)" htmlFor="phone">
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className={inputClass}
          />
        </Field>
        <Field label="Postcode" htmlFor="postcode">
          <input
            id="postcode"
            name="postcode"
            type="text"
            autoComplete="postal-code"
            required
            className={inputClass}
          />
        </Field>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium text-ink/80">Garden size</legend>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {gardenSizes.map((size) => (
            <label
              key={size.value}
              className="group relative flex cursor-pointer items-center justify-center rounded-md border border-stone bg-white px-3 py-2.5 text-center text-xs font-medium text-ink/75 transition-colors hover:border-leaf has-[:checked]:border-forest has-[:checked]:bg-forest has-[:checked]:text-cream"
            >
              <input
                type="radio"
                name="gardenSize"
                value={size.value}
                className="sr-only"
              />
              {size.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium text-ink/80">
          What can we help with? <span className="text-ink/50">(pick any)</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {services.map((s) => {
            const active = selectedServices.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => toggleService(s.id)}
                aria-pressed={active}
                className={
                  'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bloom focus-visible:ring-offset-2 focus-visible:ring-offset-cream ' +
                  (active
                    ? 'border-forest bg-forest text-cream'
                    : 'border-stone bg-white text-ink/75 hover:border-leaf')
                }
              >
                {s.name}
              </button>
            );
          })}
        </div>
      </fieldset>

      <Field label="Tell us about your garden" htmlFor="message">
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="What is the space like today, and what would you like it to feel like? Any access notes, deadlines, or things to know?"
          className={`${inputClass} min-h-[140px] resize-y`}
        />
      </Field>

      <p className="text-xs text-ink/55">
        We will reply within one working day. We do not share your details.
      </p>

      <div className="mt-2">
        <Button
          type="submit"
          size="lg"
          trailingIcon={<Icon icon={Send} size="sm" />}
        >
          Send my enquiry
        </Button>
      </div>
    </form>
  );
}

const inputClass =
  'block w-full rounded-md border border-stone bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/40 ' +
  'focus-visible:border-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bloom focus-visible:ring-offset-2 focus-visible:ring-offset-cream';

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink/80">{label}</span>
      {children}
    </label>
  );
}
