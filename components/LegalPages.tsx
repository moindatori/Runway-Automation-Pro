
import React from 'react';

interface LegalPageProps {
    page: 'about' | 'privacy' | 'terms' | 'contact';
}

export const LegalPage: React.FC<LegalPageProps> = ({ page }) => {
    const renderContent = () => {
        switch(page) {
            case 'about':
                return (
                    <>
                        <h1>About <span className="highlight">Vision Studio</span></h1>
                        <p style={{marginTop:'20px', lineHeight:'1.6', color:'var(--text-muted)'}}>
                            Vision Studio is a cutting-edge tool designed for creators, stock photographers, and AI video artists. 
                            Leveraging the power of OpenAI's GPT-4o-mini model, we automate the tedious parts of your workflow.
                        </p>
                        <p style={{marginTop:'10px', lineHeight:'1.6', color:'var(--text-muted)'}}>
                            Whether you need fine-tuned cinematic descriptions for Runway Gen-3 or comprehensive metadata for Adobe Stock, 
                            our tool processes your assets in batch, saving you hours of manual work.
                        </p>
                    </>
                );
            case 'privacy':
                return (
                    <>
                        <h1>Privacy <span className="highlight-blue">Policy</span></h1>
                        <p style={{marginTop:'20px', lineHeight:'1.6', color:'var(--text-muted)'}}>
                            <strong>Last Updated: October 2023</strong>
                        </p>
                        <h3 style={{marginTop:'20px', color:'var(--text-main)'}}>1. Data Processing</h3>
                        <p style={{marginTop:'5px', lineHeight:'1.6', color:'var(--text-muted)'}}>
                            Vision Studio operates as a client-side application. Your images are processed locally in your browser 
                            to resize them before being sent directly to OpenAI's API using your own API key. We do not store 
                            your images or API keys on our servers.
                        </p>
                        <h3 style={{marginTop:'20px', color:'var(--text-main)'}}>2. API Keys</h3>
                        <p style={{marginTop:'5px', lineHeight:'1.6', color:'var(--text-muted)'}}>
                            Your OpenAI API keys are stored exclusively in your browser's LocalStorage. You are responsible for keeping your keys secure.
                        </p>
                    </>
                );
            case 'terms':
                return (
                    <>
                        <h1>Terms of <span className="highlight">Service</span></h1>
                        <p style={{marginTop:'20px', lineHeight:'1.6', color:'var(--text-muted)'}}>
                            By using Vision Studio, you agree to the following terms:
                        </p>
                        <ul style={{marginTop:'15px', paddingLeft:'20px', color:'var(--text-muted)', lineHeight:'1.8'}}>
                            <li>You must provide your own valid OpenAI API key.</li>
                            <li>You are responsible for the content you upload and process.</li>
                            <li>The generated metadata and prompts are provided "as is" without warranty.</li>
                            <li>We are not affiliated with Adobe Stock, Runway ML, or OpenAI.</li>
                        </ul>
                    </>
                );
            case 'contact':
                return (
                    <>
                        <h1>Contact <span className="highlight-blue">Us</span></h1>
                        <p style={{marginTop:'20px', lineHeight:'1.6', color:'var(--text-muted)'}}>
                            Have questions, suggestions, or found a bug?
                        </p>
                        <div style={{marginTop:'30px', padding:'20px', background:'var(--bg-input)', borderRadius:'12px', border:'1px solid var(--border-color)'}}>
                            <p style={{fontWeight:'bold', color:'var(--text-main)'}}>Email Support</p>
                            <p style={{color:'var(--accent-cyan)', marginTop:'5px'}}>support@visionstudio.app</p>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="view-section active-view" style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
            <div id="studio-header-section" className="text-anim-enter" style={{ marginBottom: '40px' }}>
                {renderContent()}
            </div>
        </div>
    );
};
