import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Lock,
  Unlock,
  Download,
  ChevronRight,
  Hash,
  Eye,
  EyeOff,
} from "lucide-react";
import gsap from "gsap";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ThemeToggle } from "./components/ThemeToggle";

/** Utility for clean tailwind classes */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  // Global Refs for GSAP
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // -- ENCRYPTION STATE --
  const [encFile, setEncFile] = useState<File | null>(null);
  const [encPreview, setEncPreview] = useState<string | null>(null);
  const [encMessage, setEncMessage] = useState("");
  const [encPassword, setEncPassword] = useState("");
  const [encShowPass, setEncShowPass] = useState(false);
  const [encLoading, setEncLoading] = useState(false);
  const [encError, setEncError] = useState<string | null>(null);
  const [encResultUrl, setEncResultUrl] = useState<string | null>(null);

  // -- DECRYPTION STATE --
  const [decFile, setDecFile] = useState<File | null>(null);
  const [decPreview, setDecPreview] = useState<string | null>(null);
  const [decPassword, setDecPassword] = useState("");
  const [decShowPass, setDecShowPass] = useState(false);
  const [decLoading, setDecLoading] = useState(false);
  const [decError, setDecError] = useState<string | null>(null);
  const [decResultText, setDecResultText] = useState<string | null>(null);

  // -- INITIAL ANIMATIONS --
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Bold entrance
      gsap.from(headerRef.current, {
        y: -40,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
      });

      gsap.from([leftColRef.current, rightColRef.current], {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "expo.out",
        delay: 0.2,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // -- HANDLERS --

  const handleEncImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEncFile(file);
      setEncPreview(URL.createObjectURL(file));
      setEncResultUrl(null);
    }
  };

  const handleDecImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDecFile(file);
      setDecPreview(URL.createObjectURL(file));
      setDecResultText(null);
    }
  };

  const handleEncrypt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!encFile || !encPassword || !encMessage) return;

    setEncLoading(true);
    setEncError(null);
    setEncResultUrl(null);

    const formData = new FormData();
    formData.append("image", encFile);
    formData.append("password", encPassword);
    formData.append("message", encMessage);

    const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

    try {
      const response = await fetch(`${API_BASE}/api/encrypt`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errMessage = "Encryption Failed";
        try {
          const errData = await response.json();
          errMessage = errData.error || errMessage;
        } catch {}
        throw new Error(errMessage);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setEncResultUrl(url);

      // Auto-populate the decryption side!
      const transferFile = new File([blob], "secure-payload.png", {
        type: "image/png",
      });
      setDecFile(transferFile);
      setDecPreview(url);
      setDecResultText(null);

      // Auto-pulse the decrypt side to indicate transfer
      gsap.fromTo(
        rightColRef.current,
        {
          borderColor: "theme(colors.accent.gold)",
          boxShadow: "0 0 30px rgba(195,163,67,0.15)",
        },
        {
          borderColor: "theme(colors.noir.800)",
          boxShadow: "none",
          duration: 1.5,
          ease: "power2.out",
        },
      );
    } catch (err: any) {
      setEncError(err.message);
      gsap.fromTo(
        leftColRef.current,
        { x: -10 },
        { x: 0, duration: 0.4, ease: "elastic.out(1, 0.3)" },
      );
    } finally {
      setEncLoading(false);
    }
  };

  const handleDecrypt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!decFile || !decPassword) return;

    setDecLoading(true);
    setDecError(null);
    setDecResultText(null);

    const formData = new FormData();
    formData.append("image", decFile);
    formData.append("password", decPassword);

    const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

    try {
      const response = await fetch(`${API_BASE}/api/decrypt`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errMessage = "Decryption Failed";
        try {
          const errData = await response.json();
          errMessage = errData.error || errMessage;
        } catch {}
        throw new Error(errMessage);
      }

      const data = await response.json();
      setDecResultText(data.message);
    } catch (err: any) {
      setDecError(err.message);
      gsap.fromTo(
        rightColRef.current,
        { x: 10 },
        { x: 0, duration: 0.4, ease: "elastic.out(1, 0.3)" },
      );
    } finally {
      setDecLoading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen relative overflow-x-hidden flex flex-col pt-16 pb-24 px-6 md:px-12 selection:bg-noir-700 selection:text-paper-100"
    >
      {/* Editorial Header */}
      <header
        ref={headerRef}
        className="max-w-7xl mx-auto w-full mb-20 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-noir-800 pb-8"
      >
        <div>
          <p className="text-accent-gold uppercase tracking-[0.2em] text-xs font-semibold mb-3 flex items-center gap-2">
            <Hash className="w-3 h-3" /> Where secrets learn to disappear.
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-light tracking-tight leading-none text-paper-100">
            Echoes for the chosen
          </h1>
        </div>
        <div className="max-w-xs text-right flex flex-col items-end gap-4">
          <ThemeToggle />
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans">
            Cryptographic / Steganography alchemy. AES‑256 fused with
            deterministic LSB image matrices. What the eye beholds hides what
            the mind knows.
          </p>
        </div>
      </header>

      {/* Main Split Layout */}
      <main className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative">
        {/* Visual Divider (Desktop) */}
        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-noir-800 -translate-x-1/2" />

        {/* ---------------------------
            LEFT COLUMN: ENCRYPT
        --------------------------- */}
        <div
          ref={leftColRef}
          className="flex flex-col border border-noir-700 bg-noir-800/90 backdrop-blur-sm p-8 sm:p-12 transition-colors duration-500 relative group"
        >
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-serif text-3xl font-light tracking-wide text-paper-100 flex items-center gap-3">
              <Lock
                className="w-6 h-6 text-zinc-500 font-light"
                strokeWidth={1.5}
              />
              Encrypt
            </h2>
            <span className="text-xs uppercase tracking-widest text-zinc-600">
              Injection
            </span>
          </div>

          <form
            onSubmit={handleEncrypt}
            className="space-y-8 flex-1 flex flex-col"
          >
            {/* Image Upload */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-[0.15em] text-zinc-500 font-medium">
                Cover Image
              </label>
              <div className="relative group/upload">
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleEncImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  id="enc-upload"
                />
                <div
                  className={cn(
                    "w-full aspect-[4/3] border border-noir-700 rounded-lg bg-noir-900/50 flex flex-col items-center justify-center overflow-hidden transition-all duration-300",
                    encPreview
                      ? "border-noir-700"
                      : "group-hover/upload:border-accent-gold group-hover/upload:shadow-[0_0_15px_rgba(195,163,67,0.3)]",
                  )}
                >
                  {encPreview ? (
                    <img
                      src={encPreview}
                      alt="Cover"
                      className="w-full h-full object-cover opacity-100"
                    />
                  ) : (
                    <div className="text-center px-6">
                      <Upload
                        className="w-6 h-6 text-zinc-600 mx-auto mb-4 group-hover/upload:text-accent-gold transition-colors duration-500"
                        strokeWidth={1}
                      />
                      <p className="text-sm font-sans text-zinc-400">
                        Select standard image
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Hidden Payload */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-[0.15em] text-zinc-500 font-medium">
                Classified Payload
              </label>
              <textarea
                value={encMessage}
                onChange={(e) => setEncMessage(e.target.value)}
                placeholder="Transcribe data to be encrypted..."
                className="w-full bg-noir-800 border-2 border-noir-700/50 rounded-lg p-4 text-paper-100 placeholder:text-zinc-500 focus:outline-none focus:border-accent-gold hover:border-accent-gold hover:shadow-[0_0_15px_rgba(195,163,67,0.3)] focus:shadow-[0_0_15px_rgba(195,163,67,0.4)] transition-all duration-300 resize-none font-sans text-base min-h-[120px]"
              />
            </div>

            {/* Cryptographic Key */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-[0.15em] text-zinc-500 font-medium">
                Cryptographic Key
              </label>
              <div className="relative">
                <input
                  type={encShowPass ? "text" : "password"}
                  value={encPassword}
                  onChange={(e) => setEncPassword(e.target.value)}
                  placeholder="AES-256 Passphrase"
                  className="w-full bg-noir-800 border-2 border-noir-700/50 rounded-lg p-4 text-paper-100 placeholder:text-zinc-500 focus:outline-none focus:border-accent-gold hover:border-accent-gold hover:shadow-[0_0_15px_rgba(195,163,67,0.3)] focus:shadow-[0_0_15px_rgba(195,163,67,0.4)] transition-all duration-300 font-sans text-base pr-12"
                />
                <button
                  type="button"
                  onClick={() => setEncShowPass(!encShowPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-accent-gold transition-colors duration-300"
                >
                  {encShowPass ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error States */}
            {encError && (
              <p className="text-accent-crimson text-sm font-medium tracking-wide animate-fade-in border-l-2 border-accent-crimson pl-3">
                {encError}
              </p>
            )}

            {/* Submit Action */}
            <div className="pt-4 mt-auto">
              <button
                type="submit"
                disabled={encLoading || !encFile || !encPassword || !encMessage}
                className="w-full group/btn relative overflow-hidden bg-noir-800 border border-noir-700 hover:border-accent-gold text-paper-100 py-4 font-semibold tracking-widest uppercase text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 rounded-lg shadow-sm hover:shadow-[0_0_20px_rgba(195,163,67,0.4)]"
              >
                <span className="relative z-10 flex items-center justify-center gap-3 group-hover/btn:text-noir-900 transition-colors duration-300">
                  {encLoading ? "Synthesizing..." : "Execute Encryption"}
                  {!encLoading && (
                    <ChevronRight
                      className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform"
                      strokeWidth={2}
                    />
                  )}
                </span>
                <div className="absolute inset-0 bg-accent-gold translate-y-[100%] group-hover/btn:translate-y-0 transition-transform duration-500 ease-out z-0" />
              </button>
            </div>
          </form>

          {/* Result Auto-Transfer Notification */}
          {encResultUrl && (
            <div className="mt-8 pt-8 border-t border-noir-800 animate-slide-up">
              <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
                Encryption complete. The payload is securely woven.{" "}
                <span className="text-paper-100">
                  The file has been automatically mounted to the decryption
                  sector for verification.
                </span>
              </p>
              <a
                href={encResultUrl}
                download={`obscura_secure_${Date.now()}.png`}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-accent-gold hover:text-paper-100 transition-colors border-b border-accent-gold/30 hover:border-paper-100 pb-1"
              >
                <Download className="w-3 h-3" /> Download for chosen
              </a>
            </div>
          )}
        </div>

        {/* ---------------------------
            RIGHT COLUMN: DECRYPT
        --------------------------- */}
        <div
          ref={rightColRef}
          className="flex flex-col border border-noir-700 bg-noir-800/90 backdrop-blur-sm p-8 sm:p-12 transition-colors duration-500"
        >
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-serif text-3xl font-light tracking-wide text-paper-100 flex items-center gap-3">
              <Unlock
                className="w-6 h-6 text-zinc-500 font-light"
                strokeWidth={1.5}
              />
              Decrypt
            </h2>
            <span className="text-xs uppercase tracking-widest text-zinc-600">
              Extraction
            </span>
          </div>

          <form
            onSubmit={handleDecrypt}
            className="space-y-8 flex-1 flex flex-col"
          >
            {/* Image Upload */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-[0.15em] text-zinc-500 font-medium">
                Secured Image
              </label>
              <div className="relative group/upload">
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleDecImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  id="dec-upload"
                />
                <div
                  className={cn(
                    "w-full aspect-[4/3] border border-noir-700 rounded-lg bg-noir-900/50 flex flex-col items-center justify-center overflow-hidden transition-all duration-300",
                    decPreview
                      ? "border-noir-700"
                      : "group-hover/upload:border-accent-gold group-hover/upload:shadow-[0_0_15px_rgba(195,163,67,0.3)]",
                  )}
                >
                  {decPreview ? (
                    <img
                      src={decPreview}
                      alt="Secured Artifact"
                      className="w-full h-full object-cover opacity-100"
                    />
                  ) : (
                    <div className="text-center px-6">
                      <Upload
                        className="w-6 h-6 text-zinc-600 mx-auto mb-4 group-hover/upload:text-zinc-300 transition-colors duration-500"
                        strokeWidth={1}
                      />
                      <p className="text-sm font-sans text-zinc-400">
                        Select encrypted image
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Cryptographic Key */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-[0.15em] text-zinc-500 font-medium">
                Cryptographic Key
              </label>
              <div className="relative">
                <input
                  type={decShowPass ? "text" : "password"}
                  value={decPassword}
                  onChange={(e) => setDecPassword(e.target.value)}
                  placeholder="AES-256 Passphrase"
                  className="w-full bg-noir-800 border-2 border-noir-700/50 rounded-lg p-4 text-paper-100 placeholder:text-zinc-500 focus:outline-none focus:border-accent-gold hover:border-accent-gold hover:shadow-[0_0_15px_rgba(195,163,67,0.3)] focus:shadow-[0_0_15px_rgba(195,163,67,0.4)] transition-all duration-300 font-sans text-base pr-12"
                />
                <button
                  type="button"
                  onClick={() => setDecShowPass(!decShowPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-accent-gold transition-colors duration-300"
                >
                  {decShowPass ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error States */}
            {decError && (
              <p className="text-accent-crimson text-sm font-medium tracking-wide animate-fade-in border-l-2 border-accent-crimson pl-3">
                {decError}
              </p>
            )}

            {/* Decrypted Payload Result */}
            {decResultText && (
              <div className="pt-6 animate-slide-up">
                <label className="text-xs uppercase tracking-[0.15em] text-accent-gold font-medium mb-3 block">
                  Extracted Payload
                </label>
                <div className="p-6 bg-noir-900/50 border border-accent-gold rounded-lg shadow-[0_0_15px_rgba(195,163,67,0.2)] font-serif text-2xl leading-relaxed text-paper-100 break-words transition-all duration-300 hover:shadow-[0_0_20px_rgba(195,163,67,0.4)]">
                  {decResultText}
                </div>
              </div>
            )}

            {/* Submit Action */}
            <div className="pt-4 mt-auto">
              <button
                type="submit"
                disabled={decLoading || !decFile || !decPassword}
                className="w-full group/btn relative overflow-hidden bg-noir-800 border border-noir-700 hover:border-accent-gold text-paper-100 py-4 font-semibold tracking-widest uppercase text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 rounded-lg shadow-sm hover:shadow-[0_0_20px_rgba(195,163,67,0.4)]"
              >
                <span className="relative z-10 flex items-center justify-center gap-3 group-hover/btn:text-noir-900 transition-colors duration-300">
                  {decLoading ? "Extracting..." : "Execute Decryption"}
                  {!decLoading && (
                    <Unlock
                      className="w-5 h-5 group-hover/btn:scale-110 transition-transform"
                      strokeWidth={2}
                    />
                  )}
                </span>
                <div className="absolute inset-0 bg-accent-gold translate-y-[100%] group-hover/btn:translate-y-0 transition-transform duration-500 ease-out z-0" />
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
