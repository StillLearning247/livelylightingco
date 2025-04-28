import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const PrivacyContent = () => (
  <div className="prose prose-sm max-w-none">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy Policy</h2>
    <p className="text-sm text-gray-500 mb-4">Effective Date: April 25, 2025</p>

    <section className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        1. Introduction
      </h3>
      <p className="text-gray-600">
        At Lively Lighting Co. ("Company," "we," "our," or "us"), your privacy
        is a top priority. This Privacy Policy explains how we collect, use, and
        protect your personal information when you visit our website or use our
        services.
      </p>
    </section>

    <section className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        2. Information We Collect
      </h3>
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900">Personal Information</h4>
          <ul className="list-disc ml-6 text-gray-600">
            <li>First and Last Name</li>
            <li>Email Address</li>
            <li>Phone Number</li>
            <li>Service Address (City/Neighborhood)</li>
            <li>Optional Project Details</li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-gray-900">Technical Information</h4>
          <ul className="list-disc ml-6 text-gray-600">
            <li>IP address</li>
            <li>Browser type</li>
            <li>Operating system</li>
            <li>Pages viewed</li>
            <li>Time spent on our website</li>
          </ul>
        </div>
      </div>
    </section>

    <section className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        3. How We Use Your Information
      </h3>
      <ul className="list-disc ml-6 text-gray-600">
        <li>Respond to inquiries and provide quotes</li>
        <li>Schedule consultations and service appointments</li>
        <li>Improve our website and services</li>
        <li>
          Send service updates, confirmations, and important notifications
        </li>
        <li>Maintain secure client records for internal use</li>
        <li>Analyze general website usage trends</li>
      </ul>
    </section>

    <section className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        4. How Your Information Is Stored
      </h3>
      <p className="text-gray-600">
        We store information securely using trusted third-party platforms such
        as:
      </p>
      <ul className="list-disc ml-6 text-gray-600">
        <li>Supabase — for secure database storage</li>
        <li>vcita — for appointment scheduling and CRM management</li>
        <li>Netlify — for secure website hosting</li>
      </ul>
    </section>

    <section className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        5. Your Privacy Rights
      </h3>
      <p className="text-gray-600">You have the right to:</p>
      <ul className="list-disc ml-6 text-gray-600">
        <li>Request a copy of your personal data</li>
        <li>Request corrections to inaccurate data</li>
        <li>Request deletion of your personal data</li>
        <li>Opt out of communications</li>
      </ul>
    </section>

    <section className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        6. Contact Us
      </h3>
      <p className="text-gray-600">
        If you have any questions about this Privacy Policy, please contact us
        at:
      </p>
      <div className="mt-2 text-gray-600">
        <p>Lively Lighting Co.</p>
        <p>Serving Austin, Round Rock, Cedar Park, and nearby areas</p>
        <p>Email: contact@livelylightingco.com</p>
        <p>Phone: (512) 809-7323</p>
      </div>
    </section>
  </div>
);

export const PrivacyPolicy = ({
  isOpen,
  onOpen,
  onClose,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={onOpen} // <-- no (e) => { e.preventDefault(); onOpen(); }
        className="text-gray-400 hover:text-white text-sm transition-colors"
      >
        Privacy Policy
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] relative overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close privacy policy"
        >
          <X className="h-6 w-6" />
        </button>

        <PrivacyContent />
      </div>
    </div>
  );
};
