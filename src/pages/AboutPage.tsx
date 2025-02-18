
import React from 'react';

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About Us</h1>
        <div className="space-y-6">
          <p className="text-lg">
            Welcome to Adult Connect, your premier platform for connecting with verified companions and event partners. Founded with the vision of creating meaningful connections, we strive to provide a safe, respectful, and professional environment for our community.
          </p>
          <h2 className="text-2xl font-semibold mt-8">Our Mission</h2>
          <p className="text-lg">
            Our mission is to facilitate genuine connections between verified providers and clients, ensuring safety, discretion, and professionalism in every interaction.
          </p>
          <h2 className="text-2xl font-semibold mt-8">Our Values</h2>
          <ul className="list-disc pl-6 space-y-4 text-lg">
            <li>Safety First - We prioritize the safety and security of all our users</li>
            <li>Respect - We maintain a culture of mutual respect and professionalism</li>
            <li>Privacy - We ensure discretion and protect user privacy</li>
            <li>Quality - We maintain high standards for our platform and services</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
