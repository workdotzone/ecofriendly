import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Eco-Friendly Pests Control Mumbai',
    short_name: 'EcoPests',
    description: '100% safe, odorless, and eco-friendly pest control services in Mumbai.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#16a34a', // Green theme color matching your site
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}