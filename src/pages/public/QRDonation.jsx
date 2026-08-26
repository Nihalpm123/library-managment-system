import { useState } from 'react';
import { Heart, QrCode, MessageSquare, Send, CheckCircle, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import donationQr from '../../assets/donation_qr.png';

const QRDonation = () => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [copied, setCopied] = useState(false);

  const upiId = 'nihal.pm9633-1@okaxis';
  const displayPhone = '7012752550';
  const whatsappPhone = '917012752550';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getWhatsAppLink = () => {
    const message = `Hello! I have made a library donation. Here are my payment details:

Name: ${name.trim() || '[Please enter your name]'}
Amount: ${amount ? `₹${amount}` : '[Please enter amount]'}

Please find the payment screenshot attached.`;

    return `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header Section */}
      <div className="text-center mb-16">
        <div className="inline-flex p-3 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-full mb-4 animate-bounce">
          <Heart className="h-8 w-8 fill-current" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Support Salafi Library Karimbil
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
          Your donations help us acquire new books, maintain our library facilities, 
          and organize community education programs. Every contribution makes a difference.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        {/* Left Column: QR Code */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <Card className="p-8 w-full max-w-sm flex flex-col items-center border-indigo-100 dark:border-indigo-950/40 relative overflow-hidden group">
            {/* Soft decorative background pulse */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-rose-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-inner">
              <img 
                src={donationQr} 
                alt="UPI Donation QR Code" 
                className="w-64 h-64 object-contain rounded-lg mx-auto"
              />
            </div>

            <div className="mt-6 text-center w-full relative z-10">
              <span className="text-xs font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
                Scan with any UPI App
              </span>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Google Pay • PhonePe • Paytm • BHIM
              </p>
              
              {/* Copyable UPI ID Banner */}
              <div className="mt-4 p-2 bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center justify-between border border-slate-100 dark:border-slate-800">
                <span className="text-xs font-mono text-slate-600 dark:text-slate-300 break-all select-all">
                  {upiId}
                </span>
                <button 
                  type="button"
                  onClick={copyToClipboard}
                  className="ml-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:underline shrink-0"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </Card>

          {/* Description Section */}
          <div className="mt-6 text-center max-w-sm">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              After payment, please send the screenshot to this WhatsApp number:{' '}
              <a 
                href={getWhatsAppLink()} 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
              >
                {displayPhone}
                <MessageSquare className="h-4 w-4" />
              </a>
            </p>
          </div>
        </div>

        {/* Right Column: Donation Form & Info */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-8 border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <QrCode className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              Submit Payment Details
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
              Fill in your details below before scanning or after payment to instantly generate and send the message to WhatsApp.
            </p>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                window.open(getWhatsAppLink(), '_blank');
              }} 
              className="space-y-5"
            >
              <Input
                label="Your Full Name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="Donation Amount (INR)"
                type="number"
                min="1"
                placeholder="Enter amount (e.g. 500)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />

              <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100/50 dark:border-indigo-900/30 text-sm text-slate-600 dark:text-slate-400">
                <h3 className="font-semibold text-indigo-900 dark:text-indigo-300 mb-1.5 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  How to complete your donation:
                </h3>
                <ol className="list-decimal pl-5 space-y-1 text-xs">
                  <li>Scan the UPI QR Code with your mobile banking or UPI app.</li>
                  <li>Complete the payment securely in your app.</li>
                  <li>Enter your name and donation amount in the fields above.</li>
                  <li>Click the button below to open WhatsApp, and <strong>attach your payment screenshot</strong> to confirm.</li>
                </ol>
              </div>

              <Button 
                type="submit" 
                className="w-full justify-center text-sm font-semibold"
                icon={Send}
              >
                Send via WhatsApp
              </Button>
            </form>
          </Card>

          {/* Secure Trust Badge */}
          <div className="flex items-center justify-center gap-6 p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span>Direct Bank Transfer</span>
            </div>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800"></div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span>100% Transparency</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRDonation;
