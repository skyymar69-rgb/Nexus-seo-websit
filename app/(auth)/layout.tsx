import React from 'react';

export const metadata = {
  title: 'Nexus SEO - Authentification',
  description: 'Connectez-vous ou créez un compte Nexus SEO',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Left side - Branding & Illustration */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 p-8 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 text-center max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl shadow-lg">
              <span className="text-3xl font-bold text-white">N</span>
            </div>
          </div>

          {/* Branding text */}
          <h1 className="text-4xl font-bold text-white mb-4">Nexus SEO</h1>
          <p className="text-xl text-blue-100 mb-12">
            Optimisez votre visibilité en ligne avec l'intelligence artificielle
          </p>

          {/* Illustration - Geometric shapes representing SEO growth */}
          <div className="space-y-8 my-12">
            <div className="flex items-end justify-center gap-3 h-32">
              <div className="w-8 h-16 bg-gradient-to-t from-blue-400 to-blue-300 rounded-t-lg opacity-80"></div>
              <div className="w-8 h-24 bg-gradient-to-t from-indigo-400 to-indigo-300 rounded-t-lg"></div>
              <div className="w-8 h-32 bg-gradient-to-t from-blue-300 to-blue-200 rounded-t-lg opacity-80"></div>
            </div>
          </div>

          {/* Features list */}
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-400 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-blue-50">Suivi de mots-clés en temps réel</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-400 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-blue-50">Analyse complète des backlinks</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-400 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-blue-50">Rapports IA alimentés par ChatGPT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex flex-col items-center justify-center bg-white dark:bg-surface-950 p-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
