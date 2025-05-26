import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/notes');
  // Return null or a loading component if needed, as redirect might not happen instantaneously on the client.
  return null;
}
