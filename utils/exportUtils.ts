
import { PromptResult, MetaResult } from '../App';

export const exportRunwayCSV = (results: PromptResult[]) => {
    const runwayData = results.filter(r => r.type === 'runway');
    if (runwayData.length === 0) return alert("No Runway prompts to export.");

    let csvContent = "data:text/csv;charset=utf-8,Filename,Low Motion,Medium Motion,High Motion\n";
    
    // Original cleaner function
    const clean = (text: string | undefined) => `"${(text || "").replace(/"/g, '""')}"`;

    runwayData.forEach(row => {
        csvContent += `${clean(row.filename)},${clean(row.low)},${clean(row.medium)},${clean(row.high)}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "runway_prompts.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const exportDescribeTXT = (results: PromptResult[]) => {
    const descData = results.filter(r => r.type === 'describe');
    if (descData.length === 0) return alert("No descriptions to export.");

    let txtContent = "";
    descData.forEach((row, idx) => {
        // Restored exact original logic: Just the description, separated by 3 newlines
        txtContent += row.description;
        if (idx < descData.length - 1) txtContent += "\n\n\n"; 
    });

    const blob = new Blob([txtContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "image_descriptions.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const exportMetaCSV = (results: MetaResult[]) => {
    if (results.length === 0) return alert("No metadata available to export.");

    const lines = [];
    lines.push("Filename,Title,Keywords,Category");

    const clean = (value: string | number) => {
        return String(value || "")
            .replace(/"/g, '""')     // escape internal quotes
            .replace(/\r?\n/g, ' ')  // remove line breaks
            .trim();
    };

    results.forEach(row => {
        const filename = clean(row.filename || "unknown_file");
        let title = clean(row.title || "");
        let keywords = clean(row.keywords || "");
        let category = String(row.categories || "").replace(/\r?\n/g, " ");

        // Adobe requirement: Titles max ~70 characters
        if (title.length > 70) title = title.slice(0, 70);
        
        // Adobe: max 50 keywords
        let kwList = keywords.split(",").map(k => k.trim()).filter(k => k);
        if (kwList.length > 50) kwList = kwList.slice(0, 50);
        keywords = kwList.join(",");

        lines.push(`"${filename}","${title}","${keywords}",${category}`);
    });

    const csvContent = lines.join("\r\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "adobe_stock_metadata.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
