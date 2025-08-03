import React from 'react';
import { Instagram, Facebook, Music, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-20">
      <div className="max-w-[720px] mx-auto px-4 py-12">
        
        {/* Main Brand Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Himajin</h2>
            <div className="w-2 h-2 bg-primary rounded-full"></div>
          </div>
          <p className="text-gray-600 leading-relaxed max-w-md text-base font-light">
            Menyediakan produk berkualitas tinggi untuk kesehatan dan kebahagiaan hewan peliharaan kesayangan Anda
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          
          {/* Navigation */}
          <div>
            <h3 className="text-gray-900 mb-4 font-bold tracking-wide text-sm uppercase">
              Jelajahi
            </h3>
            <nav className="space-y-3">
              {['Beranda', 'Produk', 'Kategori', 'Tentang'].map((item, index) => (
                <a 
                  key={index}
                  href="#" 
                  className="block text-gray-600 hover:text-primary transition-colors duration-200 font-light"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="text-gray-900 mb-4 font-bold tracking-wide text-sm uppercase">
              Bantuan
            </h3>
            <nav className="space-y-3">
              {['FAQ', 'Panduan', 'Kebijakan', 'Dukungan'].map((item, index) => (
                <a 
                  key={index}
                  href="#" 
                  className="block text-gray-600 hover:text-primary transition-colors duration-200 font-light"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gray-900 mb-4 font-bold tracking-wide text-sm uppercase">
              Kontak
            </h3>
            <div className="space-y-3">
              <a 
                href="mailto:info@pawscare.id" 
                className="block text-gray-600 hover:text-primary transition-colors duration-200 font-light"
              >
                info@pawscare.id
              </a>
              <a 
                href="tel:+6221-8888-9999" 
                className="block text-gray-600 hover:text-primary transition-colors duration-200 font-light"
              >
                +62 21 8888 9999
              </a>
              <a 
                href="https://wa.me/6281234567890" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block text-primary hover:text-primary/80 transition-colors duration-200 font-medium"
              >
                WhatsApp
              </a>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-gray-900 mb-4 font-bold tracking-wide text-sm uppercase">
              Jam Buka
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <div className="text-gray-500 font-light">Sen - Jum</div>
                <div className="text-gray-900 font-medium">08:00 - 20:00</div>
              </div>
              <div>
                <div className="text-gray-500 font-light">Sabtu</div>
                <div className="text-gray-900 font-medium">08:00 - 18:00</div>
              </div>
              <div>
                <div className="text-gray-400 font-light">Minggu</div>
                <div className="text-gray-400 font-light">10:00 - 16:00</div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-100 pt-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-gray-900 mb-2 font-bold">
                Tetap terhubung dengan kami
              </h3>
              <p className="text-gray-500 text-sm font-light">
                Dapatkan tips perawatan hewan dan informasi produk terbaru
              </p>
            </div>
            <div className="flex items-center gap-4">
              {[
                { name: 'Instagram', icon: Instagram, href: '#' },
                { name: 'Facebook', icon: Facebook, href: '#' },
                { name: 'TikTok', icon: Music, href: '#' },
                { name: 'YouTube', icon: Youtube, href: '#' }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-gray-400 hover:text-primary transition-colors duration-200 p-2 rounded-lg hover:bg-gray-50"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-gray-100 pt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-6">
              <p className="text-gray-400 text-sm font-light">
                © 2024 PawsCare
              </p>
              <p className="text-gray-300 text-xs font-light hidden md:block">
                Dibuat dengan ❤️ untuk hewan peliharaan
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <a 
                href="#" 
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 text-sm font-light"
              >
                Privasi
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 text-sm font-light"
              >
                Syarat
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}