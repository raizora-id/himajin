import { ImageWithFallback } from '../../ui/image-with-fallback/image-with-fallback';
import profileImage from 'figma:asset/c2511b1f89c6e5b27702700c10a7a665ebaf524e.png';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Integrated Hero and Story Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            {/* Main Heading with Embedded Image - Line 1 */}
            <div className="flex items-center justify-center flex-wrap gap-2 mb-3">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Hi, saya
              </h1>
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <ImageWithFallback
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Budi,
              </h1>
            </div>
            
            {/* Line 2 */}
            <div className="flex items-center justify-center flex-wrap gap-2 mb-6">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                founder
              </h2>
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=100&h=100&fit=crop&crop=center"
                  alt="Agriculture"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                &amp; petani digital.
              </h2>
            </div>
            
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mt-6">
              Platform e-commerce yang menghubungkan petani langsung dengan konsumen di seluruh Indonesia
            </p>
          </div>
          
          {/* Integrated Content - Photos and Story */}
          <div className="w-full">
            <div className="bg-gray-50 p-8 md:p-12 mb-16 relative">
              {/* Polaroid Gallery - Positioned within the content area */}
              <div className="relative h-80 md:h-96 mb-16">
                <div className="relative w-full max-w-4xl mx-auto flex justify-center items-center">
                  {/* First Polaroid - Left */}
                  <div className="absolute left-8 md:left-16 top-4 transform -rotate-6 hover:rotate-0 transition-all duration-300 hover:scale-105 z-10">
                    <div className="bg-white p-4 shadow-xl border border-gray-200">
                      <div className="w-52 h-52 md:w-60 md:h-60 bg-gray-100 overflow-hidden mb-4">
                        <ImageWithFallback
                          src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=300&h=300&fit=crop"
                          alt="Tim kerja keras"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-sm text-gray-700 text-center font-medium">Tim kerja keras</p>
                    </div>
                    {/* Tape effect */}
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 rotate-12">
                      <div className="w-16 h-8 bg-gradient-to-b from-yellow-100 to-yellow-200 opacity-80 shadow-md border border-yellow-300/50 rounded-sm">
                        <div className="w-full h-full bg-gradient-to-r from-transparent via-yellow-50/30 to-transparent"></div>
                      </div>
                    </div>
                  </div>

                  {/* Second Polaroid - Center (overlapping both sides) */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-0 rotate-2 hover:rotate-0 transition-all duration-300 hover:scale-105 z-30">
                    <div className="bg-white p-4 shadow-xl border border-gray-200">
                      <div className="w-52 h-52 md:w-60 md:h-60 bg-gray-100 overflow-hidden mb-4">
                        <ImageWithFallback
                          src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=300&fit=crop"
                          alt="Produk segar berkualitas"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-sm text-gray-700 text-center font-medium">Produk segar berkualitas</p>
                    </div>
                    {/* Tape effect */}
                    <div className="absolute -top-3 right-4 transform -rotate-6">
                      <div className="w-16 h-8 bg-gradient-to-b from-yellow-100 to-yellow-200 opacity-80 shadow-md border border-yellow-300/50 rounded-sm">
                        <div className="w-full h-full bg-gradient-to-r from-transparent via-yellow-50/30 to-transparent"></div>
                      </div>
                    </div>
                  </div>

                  {/* Third Polaroid - Right */}
                  <div className="absolute right-8 md:right-16 top-8 transform rotate-4 hover:rotate-0 transition-all duration-300 hover:scale-105 z-20">
                    <div className="bg-white p-4 shadow-xl border border-gray-200">
                      <div className="w-52 h-52 md:w-60 md:h-60 bg-gray-100 overflow-hidden mb-4">
                        <ImageWithFallback
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
                          alt="Budi - CEO & Founder"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-sm text-gray-700 text-center font-medium">Budi - CEO &amp; Founder</p>
                    </div>
                    {/* Tape effect */}
                    <div className="absolute -top-3 left-4 transform rotate-6">
                      <div className="w-16 h-8 bg-gradient-to-b from-yellow-100 to-yellow-200 opacity-80 shadow-md border border-yellow-300/50 rounded-sm">
                        <div className="w-full h-full bg-gradient-to-r from-transparent via-yellow-50/30 to-transparent"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Story Content integrated below photos */}
              <div className="max-w-4xl mx-auto">
                <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>
                  Dimulai dari keinginan sederhana untuk membantu petani lokal mendapatkan akses pasar yang lebih 
                  luas, kami percaya bahwa teknologi dapat menjadi jembatan yang menghubungkan produsen dengan 
                  konsumen.
                </p>
                
                <p>
                  Sejak tahun 2020, kami telah membantu ribuan petani meningkatkan pendapatan mereka sambil 
                  memberikan akses produk segar berkualitas kepada konsumen di seluruh Indonesia.
                </p>
                
                <p>
                  Melalui platform digital yang mudah digunakan, kami menciptakan ekosistem yang berkelanjutan 
                  dan saling menguntungkan antara semua pihak yang terlibat.
                </p>
              </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 gap-8 mt-12 pt-8 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">1000+</div>
                    <div className="text-gray-600">Petani Mitra</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">50K+</div>
                    <div className="text-gray-600">Pelanggan Aktif</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Other Sections */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Contact Information */}
          <div className="pt-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Hubungi Kami
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Kami siap membantu Anda memulai perjalanan bisnis yang lebih baik
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-0 mb-12">
              {/* Contact Details Card */}
              <div className="bg-gray-50 p-8 rounded-lg">
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Hubungi kami untuk konsultasi dan diskusi tentang bagaimana platform kami dapat membantu mengembangkan bisnis Anda.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 text-gray-500">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">info@himajin.id</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 text-gray-500">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Telepon</p>
                      <p className="font-medium text-gray-900">+62 21 8888 9999</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 text-gray-500">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">WhatsApp</p>
                      <p className="font-medium text-gray-900">+62 812 3456 7890</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Location & Hours Card */}
              <div className="bg-gray-50 p-8 rounded-lg">
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Datang langsung ke kantor kami untuk bertemu dengan tim dan melihat operasional platform secara langsung.
                </p>
                
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-2">Alamat</p>
                      <p className="font-medium text-gray-900 leading-relaxed">
                        Jl. Pertanian No. 123<br />
                        Jakarta Selatan 12345<br />
                        Indonesia
                      </p>
                    </div>
                    <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden border border-gray-300 flex-shrink-0">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=100&h=80&fit=crop&q=80"
                        alt="Google Maps Screenshot"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Jam Operasional</p>
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <span className="text-gray-900">Senin - Jumat</span>
                        <div className="flex-1 mx-2 border-b border-dotted border-gray-300"></div>
                        <span className="font-medium text-gray-900">09:00 - 18:00</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-900">Sabtu</span>
                        <div className="flex-1 mx-2 border-b border-dotted border-gray-300"></div>
                        <span className="font-medium text-gray-900">09:00 - 15:00</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500">Minggu</span>
                        <div className="flex-1 mx-2 border-b border-dotted border-gray-300"></div>
                        <span className="text-gray-500">Tutup</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Call to Action */}
            <div className="bg-white border border-gray-200 p-8 rounded-lg text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Siap Memulai Kemitraan?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Bergabunglah dengan ribuan petani yang telah merasakan manfaat platform kami. 
                Mari bersama-sama membangun masa depan pertanian Indonesia yang lebih baik.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                  Mulai Kemitraan
                </button>
                <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Unduh Brosur
                </button>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-8 mt-8 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">1000+</div>
                  <div className="text-sm text-gray-600">Petani Mitra</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">50K+</div>
                  <div className="text-sm text-gray-600">Pelanggan Aktif</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">25+</div>
                  <div className="text-sm text-gray-600">Kota</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}