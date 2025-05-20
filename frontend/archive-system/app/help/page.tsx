'use client';

import { FiHelpCircle, FiMail, FiPhone, FiInfo } from 'react-icons/fi';

export default function HelpPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-semibold mb-6 flex items-center gap-2">
        <FiHelpCircle className="text-blue-600" />
        Help & Support
      </h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">📌 Frequently Asked Questions</h2>
        <ul className="space-y-4 text-gray-700">
          <li>
            <strong>How do I upload a document?</strong><br />
            Navigate to the "Upload" section, select your file, choose a folder, and submit. Make sure the file type is allowed.
          </li>
          <li>
            <strong>How can I restore from backup?</strong><br />
            Go to "Restore" and click on the latest backup. Your documents and settings will be restored.
          </li>
          <li>
            <strong>Who has access to my files?</strong><br />
            Only authenticated users with the right roles (admin or general) can access specific folders or features.
          </li>
          <li>
            <strong>How do I change my password?</strong><br />
            Password management is currently handled by the system administrator. Contact support for password updates.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">📞 Contact Support</h2>
        <div className="text-gray-700 space-y-2">
          <p className="flex items-center gap-2">
            <FiMail className="text-blue-600" /> support@towfiqlogistics.com
          </p>
          <p className="flex items-center gap-2">
            <FiPhone className="text-blue-600" /> +254 712 345 678
          </p>
          <p className="flex items-center gap-2">
            <FiInfo className="text-blue-600" /> Our support team is available Mon–Fri, 8:00am–5:00pm.
          </p>
        </div>
      </section>
    </div>
  );
}
