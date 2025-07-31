import { Header } from "@/components/Landing/header";
import { Hero } from "@/components/Landing/hero";
import { Features } from "@/components/Landing/featured";
import { FeaturedProducts } from "@/components/Landing/productShowcase";
import { Testimonials } from "@/components/Landing/testimonials";
import { CallToAction } from "@/components/Landing/callToAction";
import { ContactUs } from "@/components/Landing/ContactUs";
import { Footer } from "@/components/Landing/footer";


export default function LandingPage() {
  return (
    <>
      <Header />
      <section id="home">
      <Hero />
      </section>
      <section id="features">
        <Features />
      </section>
      <section id="products">
        <FeaturedProducts />
      </section>
      <section id="testimonials">
        <Testimonials />
      </section>
      <CallToAction />
      <section id="contact">
        <ContactUs/>
      </section>
      <Footer />
    </>
  );
}