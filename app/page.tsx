import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to latest news - this is a functional app, not marketing
  redirect('/latest');
}
