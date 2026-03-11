import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function UpvoteWidget() {
  const [user, setUser] = useState<{ uid: string; email: string | null } | null>(null);

  useEffect(() => {
    // Listen for auth changes to update widget identity
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser({ uid: u.uid, email: u.email });
      } else {
        setUser(null);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    // Programmatically load the script only once
    const scriptId = 'upvote-widget-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = "https://upvote.entrext.com/widget.js";
      script.async = true;
      document.body.appendChild(script);
    }

    return () => {
      // We generally don't want to remove the script on every toggle
      // but if the user SNIPPET had a cleanup function, we can call it
      // @ts-ignore
      if (window.__upvote_cleanup) window.__upvote_cleanup();
    };
  }, []);

  return (
    <div className="upvote-widget-container" style={{ position: 'relative', zIndex: 9999 }}>
      <div className="upvote-widget"
           data-application-id="69ad7733006229180183c1f7"
           data-user-id={user?.uid || ''}
           data-email={user?.email || ''}
           data-position="right" />
    </div>
  );
}
