// Simple markdown parser
function parseMarkdown(markdown) {
    let html = markdown;
    
    // Convert images: ![alt](url) to <img>
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
    
    // Convert headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Convert bold: **text** or __text__
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    
    // Convert italic: *text* or _text_
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/_([^_]+)_/g, '<em>$1</em>');
    
    // Convert line breaks to paragraphs
    html = html.split('\n\n').map(para => {
        if (para.trim() && !para.startsWith('<h') && !para.startsWith('<img')) {
            return '<p>' + para.replace(/\n/g, '<br>') + '</p>';
        }
        return para;
    }).join('\n');
    
    return html;
}

// State management
let currentState = {
    subject: null,
    part: null,
    chapter: null
};

// Subject folder structure mapping
const subjectFolders = {
    'Physicss': {
        displayName: 'Physics',
        parts: [
            { folder: 'Physics 1st ', displayName: 'Physics 1st Part' },
            { folder: 'Physics 2nd', displayName: 'Physics 2nd Part' }
        ]
    },
    'Chemistry': {
        displayName: 'Chemistry',
        parts: [
            { folder: 'Chem-1', displayName: 'Chemistry 1st Part' },
            { folder: 'Chem-2', displayName: 'Chemistry 2nd Part' }
        ]
    },
    'Math': {
        displayName: 'Mathematics',
        parts: [
            { folder: 'Math-1', displayName: 'Math 1st Part' },
            { folder: 'Math-2', displayName: 'Math 2nd Part' }
        ]
    }
};

// Chapter files for each part
const chapterFiles = {
    'Physics 1st ': [
        { file: 'CH-2(Vector).md', title: 'Chapter 2 - Vector' },
        { file: 'CH-4(Newtanian Mechanics).md', title: 'Chapter 4 - Newtonian Mechanics' },
        { file: 'CH-5(Work - Energy - Power).md', title: 'Chapter 5 - Work, Energy & Power' },
        { file: 'CH-6 (Gravity).md', title: 'Chapter 6 - Gravity' },
        { file: 'CH-7 (Properties of Matter).md', title: 'Chapter 7 - Properties of Matter' },
        { file: 'CH-8 (Periodic Motion).md', title: 'Chapter 8 - Periodic Motion' },
        { file: 'CH-10 (Ideal Gass).md', title: 'Chapter 10 - Ideal Gas' }
    ],
    'Physics 2nd': [
        { file: 'CH-1 (Thermodynamics).md', title: 'Chapter 1 - Thermodynamics' },
        { file: 'CH-2 (ElectroStatics).md', title: 'Chapter 2 - Electrostatics' },
        { file: 'CH-3(Current Electricity).md', title: 'Chapter 3 - Current Electricity' },
        { file: 'CH-7 (Optics).md', title: 'Chapter 7 - Optics' },
        { file: 'CH-8 (Modern Physics) .md', title: 'Chapter 8 - Modern Physics' }
    ],
    'Chem-1': [
        { file: 'CH-1.md', title: 'Chapter 1' }
    ],
    'Chem-2': [
        { file: 'CH-2 (ORGANIC).md', title: 'Chapter 2 - Organic Chemistry' }
    ],
    'Math-1': [
        { file: 'CH-1 (Matrix).md', title: 'Chapter 1 - Matrix' },
        { file: 'CH-3 (Straight Line) .md', title: 'Chapter 3 - Straight Line' },
        { file: 'CH-4 (Circle).md', title: 'Chapter 4 - Circle' },
        { file: 'CH- 7 (Triogonometry).md', title: 'Chapter 7 - Trigonometry' },
        { file: 'CH-9 & 10(Calculas).md', title: 'Chapter 9 & 10 - Calculus' }
    ],
    'Math-2': [
        { file: 'CH-3(Complex Number).md', title: 'Chapter 3 - Complex Number' },
        { file: 'CH-4(Polynomial.md', title: 'Chapter 4 - Polynomial' },
        { file: 'CH- 6 (CONICS).md', title: 'Chapter 6 - Conics' },
        { file: 'CH-7 (Inverse Trigo).md', title: 'Chapter 7 - Inverse Trigonometry' }
    ]
};

// Show/hide views
function showView(viewId) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(viewId).classList.add('active');
}

// Show home page
function showHome() {
    currentState = { subject: null, part: null, chapter: null };
    showView('home-view');
}

// Show subject parts
function showSubject(subject) {
    currentState.subject = subject;
    currentState.part = null;
    currentState.chapter = null;

    const subjectData = subjectFolders[subject];
    document.getElementById('subject-title').textContent = subjectData.displayName;

    const partsList = document.getElementById('parts-list');
    partsList.innerHTML = '';

    subjectData.parts.forEach(part => {
        const partCard = document.createElement('div');
        partCard.className = 'part-card';
        partCard.onclick = () => showPart(part.folder);
        
        partCard.innerHTML = `
            <h3>${part.displayName}</h3>
            <p>Click to view chapters →</p>
        `;
        
        partsList.appendChild(partCard);
    });

    showView('subject-view');
}

// Show chapters in a part
function showPart(partFolder) {
    currentState.part = partFolder;
    currentState.chapter = null;

    const chapters = chapterFiles[partFolder] || [];
    document.getElementById('chapter-title').textContent = partFolder;

    const chaptersList = document.getElementById('chapters-list');
    chaptersList.innerHTML = '';

    if (chapters.length === 0) {
        chaptersList.innerHTML = '<p>No chapters available yet.</p>';
    } else {
        chapters.forEach((chapter, index) => {
            const chapterCard = document.createElement('div');
            chapterCard.className = 'chapter-card';
            chapterCard.onclick = () => showContent(chapter.file, chapter.title);
            
            chapterCard.innerHTML = `
                <div class="chapter-icon">📖</div>
                <div class="chapter-info">
                    <h4>${chapter.title}</h4>
                </div>
            `;
            
            chaptersList.appendChild(chapterCard);
        });
    }

    showView('chapter-view');
}

// Show markdown content
async function showContent(fileName, title) {
    currentState.chapter = fileName;

    const contentDiv = document.getElementById('markdown-content');
    contentDiv.innerHTML = '<p>Loading...</p>';

    try {
        const filePath = `${currentState.subject}/${currentState.part}/${fileName}`;
        const response = await fetch(filePath);
        
        if (!response.ok) {
            throw new Error('File not found');
        }

        const markdown = await response.text();
        
        // Convert markdown to HTML using our simple parser
        const html = parseMarkdown(markdown);
        
        contentDiv.innerHTML = `<h1>${title}</h1>${html}`;
    } catch (error) {
        contentDiv.innerHTML = `
            <h2>Error Loading Content</h2>
            <p>Could not load the chapter. Please try again.</p>
            <p>Error: ${error.message}</p>
        `;
    }

    showView('content-view');
}

// Back navigation functions
function showSubjectParts() {
    if (currentState.subject) {
        showSubject(currentState.subject);
    } else {
        showHome();
    }
}

function showChapters() {
    if (currentState.part) {
        showPart(currentState.part);
    } else if (currentState.subject) {
        showSubject(currentState.subject);
    } else {
        showHome();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    showHome();
});
