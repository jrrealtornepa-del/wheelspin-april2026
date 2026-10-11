import React from 'react';
import {
  FACEBOOK_PAGE_URL,
  FACEBOOK_PAGE_NAME,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
} from '../config/social';

const encodedPage = encodeURIComponent(FACEBOOK_PAGE_URL);

const facebookPageSrc =
  `https://www.facebook.com/plugins/page.php?href=${encodedPage}` +
  '&tabs=timeline&width=340&height=500&small_header=false' +
  '&adapt_container_width=true&hide_cover=false&show_facepile=true';

const facebookLikeSrc =
  `https://www.facebook.com/plugins/like.php?href=${encodedPage}` +
  '&width=180&layout=button_count&action=like&size=large&share=true';

const instagramEmbedSrc = `https://www.instagram.com/${INSTAGRAM_HANDLE}/embed`;

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden="true">
      <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden="true">
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zM12 16a4 4 0 110-8 4 4 0 010 8zm6.4-11.85a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" />
    </svg>
  );
}

export default function SocialSection({ onClick }) {
  return (
    <section
      aria-labelledby="social-heading"
      className="relative z-20 py-16 px-4 bg-gradient-to-b from-slate-900 via-slate-900 to-black text-white"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 reveal">
          <p className="text-sm uppercase tracking-widest text-yellow-300 font-bold mb-2">
            Stay Connected
          </p>
          <h2 id="social-heading" className="text-3xl md:text-5xl font-black text-balance mb-3">
            Like & Follow {FACEBOOK_PAGE_NAME}
          </h2>
          <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto text-pretty">
            Get winner announcements, event updates, and NEPA real estate tips first.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <article className="depth-card bg-white text-gray-900 rounded-3xl p-6 reveal reveal-left">
            <header className="flex items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <span className="w-12 h-12 rounded-2xl bg-[#1877F2] text-white flex items-center justify-center shadow-lg">
                  <FacebookIcon />
                </span>
                <div>
                  <h3 className="font-black text-xl leading-tight">Facebook</h3>
                  <p className="text-sm text-gray-500">{FACEBOOK_PAGE_NAME}</p>
                </div>
              </div>
              <a
                href={FACEBOOK_PAGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClick}
                className="btn-3d btn-3d-facebook text-sm py-2 px-4"
              >
                Follow
              </a>
            </header>

            <div className="flex justify-center mb-5 min-h-[40px]">
              <iframe
                title={`Like ${FACEBOOK_PAGE_NAME} on Facebook`}
                src={facebookLikeSrc}
                width="180"
                height="40"
                style={{ border: 'none', overflow: 'hidden' }}
                scrolling="no"
                frameBorder="0"
                allow="encrypted-media; clipboard-write; web-share"
                loading="lazy"
              />
            </div>

            <div className="flex justify-center rounded-2xl overflow-hidden bg-gray-50 shadow-inner">
              <iframe
                title={`${FACEBOOK_PAGE_NAME} Facebook page timeline`}
                src={facebookPageSrc}
                width="340"
                height="500"
                className="max-w-full"
                style={{ border: 'none', overflow: 'hidden' }}
                scrolling="no"
                frameBorder="0"
                allow="encrypted-media; clipboard-write; web-share"
                loading="lazy"
              />
            </div>
          </article>

          <article className="depth-card bg-white text-gray-900 rounded-3xl p-6 reveal reveal-right">
            <header className="flex items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <span className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white flex items-center justify-center shadow-lg">
                  <InstagramIcon />
                </span>
                <div>
                  <h3 className="font-black text-xl leading-tight">Instagram</h3>
                  <p className="text-sm text-gray-500">@{INSTAGRAM_HANDLE}</p>
                </div>
              </div>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClick}
                className="btn-3d btn-3d-instagram text-sm py-2 px-4"
              >
                Follow
              </a>
            </header>

            <div className="rounded-2xl overflow-hidden bg-gray-50 shadow-inner">
              <iframe
                title={`@${INSTAGRAM_HANDLE} Instagram profile`}
                src={instagramEmbedSrc}
                width="100%"
                height="540"
                style={{ border: 'none' }}
                scrolling="no"
                frameBorder="0"
                allowTransparency="true"
                loading="lazy"
              />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
