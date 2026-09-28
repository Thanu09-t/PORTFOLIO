"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { CERTIFICATIONS, type Certification } from "@/lib/data";
import ScrollRevealText from "./ScrollRevealText";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

export default function Certifications() {
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  return (
    <section id="certifications" className="pt-36 pb-24 px-6 md:px-24">
      <div className="max-w-4xl mb-12">
        <motion.p
          className="eyebrow text-[#F4AEA8]"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          variants={fadeUp}
        >
          CERTIFICATIONS & CREDENTIALS
        </motion.p>
        <ScrollRevealText
          text="Accredited proof of competence."
          className="font-display font-semibold text-[2rem] md:text-[4rem] leading-[1.05] tracking-tight mt-3"
          stagger={0.5}
        />
        <p className="text-[#BBC6CF] mt-4 max-w-2xl leading-[1.7] text-[0.95rem]">
          Official industry certifications spanning Generative AI, prompt engineering, machine learning pipelines, and technical professionalism.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl">
        {CERTIFICATIONS.map((cert, index) => (
          <CertificateCard
            key={cert.id}
            cert={cert}
            index={index}
            onOpenModal={() => setSelectedCert(cert)}
          />
        ))}
      </div>

      {/* Lightbox / Modal Preview */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            className="fixed inset-0 z-[600] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              className="relative max-w-4xl w-full bg-[#0F1013] border border-[#4C5665] rounded-lg p-6 overflow-hidden max-h-[90vh] flex flex-col"
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 border-b border-[#4C5665]/60 pb-4 mb-4">
                <div>
                  <div className="font-mono text-[11px] text-[#F4AEA8] uppercase tracking-wider">
                    {selectedCert.issuer}
                  </div>
                  <h3 className="font-display font-semibold text-lg md:text-xl text-[#E1E3E4] mt-1">
                    {selectedCert.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="text-[#BBC6CF] hover:text-white p-1 rounded font-mono text-sm border border-[#4C5665]/50 px-2 py-0.5 transition-colors"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              <div className="relative flex-1 min-h-[300px] md:min-h-[460px] bg-black/40 rounded border border-[#4C5665]/40 overflow-hidden mb-4 flex items-center justify-center">
                <Image
                  src={selectedCert.image}
                  alt={selectedCert.title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              <div className="flex items-center justify-between gap-4 flex-wrap pt-2 border-t border-[#4C5665]/60">
                <div className="font-mono text-xs text-[#BBC6CF]">
                  {selectedCert.credentialId && (
                    <span className="mr-3">ID: {selectedCert.credentialId}</span>
                  )}
                  <span>Completed: {selectedCert.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  {selectedCert.verifyUrl && (
                    <a
                      href={selectedCert.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-[#BBC6CF] hover:text-white transition-colors underline-offset-4 hover:underline"
                    >
                      Verify Online ↗
                    </a>
                  )}
                  <a
                    href={selectedCert.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs bg-[#920513] text-white px-3.5 py-1.5 rounded font-medium hover:bg-[#b01323] transition-colors"
                  >
                    Open PDF Document ↗
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function CertificateCard({
  cert,
  index,
  onOpenModal,
}: {
  cert: Certification;
  index: number;
  onOpenModal: () => void;
}) {
  return (
    <motion.article
      className="card-panel rounded-md border border-[#4C5665] card-3d flex flex-col justify-between overflow-hidden group hover:border-[#F4AEA8]/60 transition-colors duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <div>
        {/* Certificate Image Thumbnail with hyperlink */}
        <div className="relative aspect-[16/10] bg-[#0A0B0E] border-b border-[#4C5665]/60 overflow-hidden">
          <Image
            src={cert.image}
            alt={cert.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-top filter brightness-[0.88] group-hover:scale-105 group-hover:brightness-100 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F1013] via-transparent to-transparent opacity-80" />

          {/* Quick Preview & Open Action Buttons */}
          <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/40 backdrop-blur-[2px]">
            <button
              onClick={onOpenModal}
              data-cursor="PREVIEW"
              className="bg-[#0F1013]/90 text-[#E1E3E4] border border-[#4C5665] hover:border-white px-3 py-1.5 rounded text-xs font-mono tracking-wider transition-colors"
            >
              Preview
            </button>
            <a
              href={cert.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="OPEN"
              className="bg-[#920513] text-white px-3 py-1.5 rounded text-xs font-mono tracking-wider hover:bg-[#b01323] transition-colors"
            >
              Open PDF ↗
            </a>
          </div>

          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-mono">
            <span className="bg-[#0F1013]/85 text-[#F4AEA8] px-2 py-0.5 rounded border border-[#4C5665]/60 truncate max-w-[70%]">
              {cert.issuer.split("(")[0].trim()}
            </span>
            <span className="text-[#BBC6CF] bg-[#0F1013]/85 px-2 py-0.5 rounded border border-[#4C5665]/60">
              {cert.date}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6">
          {/* Hyperlinked Certificate Title */}
          <h3 className="font-display font-semibold text-lg md:text-xl text-[#E1E3E4] leading-snug">
            <a
              href={cert.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="CERT"
              className="hover:text-[#F4AEA8] transition-colors inline"
            >
              {cert.title}
              <span className="inline-block ml-1.5 text-xs text-[#F4AEA8] opacity-70 group-hover:opacity-100 transition-opacity">
                ↗
              </span>
            </a>
          </h3>

          {cert.credentialId && (
            <div className="mt-2 font-mono text-[10px] text-[#8E9CA8] tracking-wider truncate">
              ID: <span className="text-[#BBC6CF]">{cert.credentialId}</span>
            </div>
          )}

          <p className="text-[#BBC6CF] mt-3 leading-[1.6] text-[0.88rem]">
            {cert.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-4">
            {cert.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[10px] tracking-wide px-2 py-0.5 rounded bg-[#16181D] border border-[#4C5665]/50 text-[#BBC6CF]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer Links */}
      <div className="px-6 py-3.5 border-t border-[#4C5665]/60 bg-[#0F1013]/40 flex items-center justify-between gap-3 text-xs font-mono">
        <a
          href={cert.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="VIEW"
          className="text-[#F4AEA8] hover:text-white inline-flex items-center gap-1 transition-colors underline-offset-4 hover:underline"
        >
          View Certificate ↗
        </a>
        {cert.verifyUrl && (
          <a
            href={cert.verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="VERIFY"
            className="text-[#BBC6CF] hover:text-[#F4AEA8] inline-flex items-center gap-1 transition-colors underline-offset-4 hover:underline"
          >
            Verify Online ↗
          </a>
        )}
      </div>
    </motion.article>
  );
}
