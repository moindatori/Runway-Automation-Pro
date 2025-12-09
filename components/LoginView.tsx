
import React, { useEffect } from 'react';
import { decodeJwt } from '../utils/authUtils';

interface LoginViewProps {
    onSuccess: (user: any) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSuccess }) => {

    useEffect(() => {
        // @ts-ignore
        if (window.google) {
            // @ts-ignore
            window.google.accounts.id.initialize({
                client_id: "YOUR_GOOGLE_CLIENT_ID", // Replace with actual Client ID
                callback: (response: any) => {
                    const userObject = decodeJwt(response.credential);
                    onSuccess(userObject);
                }
            });
            // @ts-ignore
            window.google.accounts.id.renderButton(
                document.getElementById("googleSignInDiv"),
                { theme: "outline", size: "large", type: "standard", shape: "pill", text: "continue_with" }
            );
        }
    }, [onSuccess]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center' }}>
            <div id="studio-header-section" className="text-anim-enter" style={{ opacity: 1 }}>
                <div className="powered-tag"><div className="dot"></div> Powered by Gemini 2.5 Flash</div>
                <h1>Welcome to <span className="highlight">GeminiVision</span></h1>
                <p style={{ marginTop: '16px', color: 'var(--text-muted)', maxWidth: '400px' }}>
                    Sign in to access advanced AI tools for Runway video prompts and Adobe Stock metadata generation.
                </p>
                <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
                    <div id="googleSignInDiv"></div>
                </div>
            </div>
        </div>
    );
};
