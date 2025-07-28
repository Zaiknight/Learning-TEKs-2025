"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Add your API call here
    setSent(true);
  }

  return (
    <section id="contact" className="w-full py-16 bg-muted/60">
      <div className="container mx-auto max-w-2xl rounded-lg shadow p-8 bg-background">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">Contact Us</h2>
        {sent ? (
          <div className="text-center text-green-600 font-medium py-8">
            Thank you for reaching out! We&apos;ll get back to you soon.
          </div>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <Textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="How can we help you?"
                rows={5}
                required
                className="mt-1"
              />
            </div>
            <Button type="submit" className="mt-2">
              Send Message
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}