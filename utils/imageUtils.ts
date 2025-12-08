
export const resizeImage = (file: File, maxSize: number = 250): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                let width = img.width;
                let height = img.height;
                
                // Force aspect ratio scaling to maxSize (250px)
                if (width > height) {
                    if (width > maxSize) {
                        height *= maxSize / width;
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width *= maxSize / height;
                        height = maxSize;
                    }
                }
                
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                if(ctx) {
                    // ENABLE HIGH QUALITY SMOOTHING
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';

                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Compress to JPEG 0.95 for higher fidelity
                    // While 250px is small, this ensures artifacts are minimized
                    resolve(canvas.toDataURL('image/jpeg', 0.95).split(',')[1]);
                } else {
                    reject("Canvas context error");
                }
            };
            img.onerror = () => reject("Image load error");
            img.src = e.target?.result as string;
        };
        reader.onerror = () => reject("File read error");
        reader.readAsDataURL(file);
    });
};

export const extractVideoFrame = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.src = URL.createObjectURL(file);
        video.muted = true; 
        video.playsInline = true; 
        video.currentTime = 1.0; 
        video.onseeked = () => {
            const canvas = document.createElement('canvas');
            const maxSize = 250; 
            let width = video.videoWidth;
            let height = video.videoHeight;
            if (width > height) {
                if (width > maxSize) { height *= maxSize / width; width = maxSize; }
            } else {
                if (height > maxSize) { width *= maxSize / height; height = maxSize; }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if(ctx) {
                // ENABLE HIGH QUALITY SMOOTHING
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';

                ctx.drawImage(video, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.95).split(',')[1]);
            } else {
                reject("Canvas error");
            }
        };
        video.onerror = () => reject("Video error");
        video.load();
    });
};

export const readSvgAsBase64 = (file: File): Promise<string> => {
    return new Promise((res, rej) => { 
        const r = new FileReader(); 
        r.readAsText(file); 
        r.onload = () => res(btoa(r.result as string)); 
        r.onerror = rej; 
    });
};