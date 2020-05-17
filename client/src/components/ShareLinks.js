import React, { useState, useEffect, useRef } from 'react';

export default function ShareLinks({title}) {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState(null);
    let timeout;
    const setStatus = msg => {
        setMessage(msg);
        timeout = setTimeout(() => {
            setMessage(null);
            setIsOpen(false);
        }, 2000);
    }
    const copyToClipboard = ref => {
        ref.current.select();
        document.execCommand('copy');
    }
    const linkRef = useRef();

    const links = () => {
        if (window.navigator.share) {
            window.navigator.share({
            title: 'Link to '+title+' session',
            url: window.location.href
            }).then(() => {
                setStatus('Link Shared!')
            })
            .catch(console.error);
        } else {
            copyToClipboard(linkRef);
            setStatus('Link copied to clipboard!')
        }
    }
    useEffect(() => {
        return () => {
            clearTimeout(timeout);
        }
    }, [timeout]);

    return (
        <section>
            <input style={{opacity: 0, width: '1px', position: "absolute", left: '-100vw'}} ref={linkRef} value={window.location.href} readOnly />
            {isOpen ? message ? <div>{message}</div> : links() : <button onClick={() => setIsOpen(true)}>Share Link</button>}
        </section>
    )
}