
import React from 'react';

const SafetyPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Safety Guidelines</h1>
        <div className="space-y-6">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Personal Safety</h2>
            <ul className="list-disc pl-6 space-y-4">
              <li>Always meet in public places for initial meetings</li>
              <li>Share your location with a trusted friend</li>
              <li>Trust your instincts - if something feels wrong, leave</li>
              <li>Keep personal information private until you're comfortable</li>
              <li>Use our in-app messaging system for communication</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Online Safety</h2>
            <ul className="list-disc pl-6 space-y-4">
              <li>Use a strong, unique password</li>
              <li>Never share your login credentials</li>
              <li>Be cautious with personal information</li>
              <li>Report suspicious behavior immediately</li>
              <li>Enable two-factor authentication when available</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Reporting Issues</h2>
            <p className="mb-4">
              If you encounter any safety concerns or suspicious behavior, please report it immediately:
            </p>
            <ul className="list-disc pl-6 space-y-4">
              <li>Use the in-app reporting feature</li>
              <li>Contact our support team</li>
              <li>In case of emergency, contact local authorities</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SafetyPage;
