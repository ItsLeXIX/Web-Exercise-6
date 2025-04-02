// Define a Note type for type safety
type Note = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';

// Interface for a piano key
interface PianoKey {
    note: Note;
    element: HTMLDivElement;
    play(): void;
}

// Piano key class implementing the interface
class BasicPianoKey implements PianoKey {
    constructor(public note: Note, public element: HTMLDivElement) {
        this.element.addEventListener("click", () => this.play());
    }

    play(): void {
        console.log(`Playing note: ${this.note}`);
        this.element.classList.add("active");
        setTimeout(() => this.element.classList.remove("active"), 200);

        const noteLine = document.getElementById("note-line");
        if (noteLine) {
            const span = document.createElement("span");
            span.className = "note";
            span.textContent = this.note;
            noteLine.appendChild(span);
        }

        const staff = document.getElementById("music-staff");
        if (staff) {
            const noteDot = document.createElement("div");
            noteDot.className = "note-dot";
            noteDot.style.setProperty("--y", `${noteYPositions[this.note]}px`);
            noteDot.style.setProperty("--x", `${staff.children.length * 30}px`);
            staff.appendChild(noteDot);
        }
    }
}

// Key mapping from keyboard key to piano note
const keyMappings: { [key: string]: Note } = {
    a: "C",
    s: "D",
    d: "E",
    f: "F",
    g: "G",
    h: "A",
    j: "B",
};

// Notes positioning on the staff
const noteYPositions: Record<Note, number> = {
    C: 88,
    D: 76,
    E: 64,
    F: 52,
    G: 40,
    A: 28,
    B: 16
};

// Create piano keys from DOM elements
const keys: PianoKey[] = [];

Object.values(keyMappings).forEach((note: Note) => {
    const el = document.getElementById(`key${note}`);
    if (el instanceof HTMLDivElement) {
        keys.push(new BasicPianoKey(note, el));
    }
});

// Keyboard event listener
window.addEventListener("keydown", (e: KeyboardEvent) => {
    const note = keyMappings[e.key.toLowerCase()];
    if (note) {
        const key = keys.find(k => k.note === note);
        key?.play();
    }
});

// Reset button functionality
const resetButton = document.getElementById("reset-notes");
if (resetButton instanceof HTMLButtonElement) {
    resetButton.addEventListener("click", () => {
        keys.forEach(k => k.element.classList.remove("active"));
        const noteLine = document.getElementById("note-line");
        if (noteLine) noteLine.innerHTML = "";

        const staff = document.getElementById("music-staff");
        if (staff) staff.innerHTML = "";
    });
}