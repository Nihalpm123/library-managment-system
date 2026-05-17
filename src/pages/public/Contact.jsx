import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import toast from 'react-hot-toast';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent successfully!');
    e.target.reset();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Contact Us</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Get in Touch</h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Address</h3>
                <p className="text-slate-600 dark:text-slate-400 mt-1">123 Library Street, Knowledge City<br />NY 10001, USA</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Phone</h3>
                <p className="text-slate-600 dark:text-slate-400 mt-1">+1 (555) 123-4567</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Email</h3>
                <p className="text-slate-600 dark:text-slate-400 mt-1">contact@lmsportal.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Name" required placeholder="Your full name" />
            <Input label="Email" type="email" required placeholder="you@example.com" />
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Message
              </label>
              <textarea
                required
                rows={4}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 placeholder-slate-400 dark:placeholder-slate-500 transition-colors resize-none"
                placeholder="How can we help you?"
              ></textarea>
            </div>

            <Button type="submit" className="w-full" icon={Send}>
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
