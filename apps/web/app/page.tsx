import { redirect } from 'next/navigation';

export default function Page() {
  return (
    <div className="flex flex-col md:flex-row">
      <p>Next JS Application</p>
    </div>
  );
  // redirect('/main');
}