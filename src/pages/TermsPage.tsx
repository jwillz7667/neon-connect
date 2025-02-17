
import React from 'react';

const TermsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Terms and Conditions</h1>
        <div className="space-y-6">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using NeonConnect, you agree to be bound by these Terms and Conditions, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. User Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-4">
              <li>You must be 18 years or older to use this service</li>
              <li>You agree to provide accurate and complete information</li>
              <li>You are responsible for maintaining the confidentiality of your account</li>
              <li>You agree not to use the service for illegal purposes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Service Rules</h2>
            <ul className="list-disc pl-6 space-y-4">
              <li>No harassment or abuse of other users</li>
              <li>No fraudulent or misleading behavior</li>
              <li>No sharing of explicit or inappropriate content</li>
              <li>No commercial solicitation without authorization</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Termination</h2>
            <p>
              We reserve the right to terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
            <p>
              NeonConnect shall not be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
