import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doc, increment, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';// Adjust path to your firebase config

// 1. Data Structure
const questions = [
    { text: "Which Article deals with the impeachment of the President?", options: ["Art 61", "Art 72", "Art 75"], correct: 0 },
    { text: "Who was the first woman President of the INC?", options: ["Sarojini Naidu", "Annie Besant", "Nellie Sengupta"], correct: 1 }
];

export function QuizEngine() {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [selectedOpt, setSelectedOpt] = useState<number | null>(null);

    // 2. Database Persistence Logic
    const saveProgress = async (finalScore: number) => {
        try {
            const userRef = doc(db, 'users', 'user123'); // Replace 'user123' with Auth UID
            await updateDoc(userRef, {
                xp: increment(finalScore),
                lastUpdated: new Date().toISOString()
            });
            console.log("✅ XP updated in Firestore");
        } catch (err) {
            console.error("❌ Failed to save progress:", err);
        }
    };

    // 3. Handle Answer Logic
    const handleAnswer = (index: number) => {
        setSelectedOpt(index);
        const isCorrect = index === questions[currentIdx].correct;
        let newScore = score;

        if (isCorrect) {
            newScore += 10;
            setScore(newScore);
        }

        setTimeout(() => {
            if (currentIdx < questions.length - 1) {
                setCurrentIdx(currentIdx + 1);
                setSelectedOpt(null);
            } else {
                setIsFinished(true);
                saveProgress(newScore); // Trigger DB save on finish
            }
        }, 800);
    };

    // 4. UI for Finished State
    if (isFinished) return (
        <div className="p-8 bg-white rounded-3xl shadow-xl border border-blue-100 text-center max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-blue-600 mb-4">Challenge Complete!</h2>
            <p className="text-xl mb-6">Total XP Earned: <span className="font-bold">{score}</span></p>
            <Link to="/" className="bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800 transition">Return to Dashboard</Link>
        </div>
    );

    // 5. UI for Game State
    return (
        <div className="p-8 bg-white rounded-3xl shadow-lg border border-slate-100 max-w-lg mx-auto">
            <div className="mb-6 flex justify-between text-sm text-slate-400">
                <span>Question {currentIdx + 1}/{questions.length}</span>
                <span>XP: {score}</span>
            </div>

            <h2 className="text-xl font-semibold text-slate-800 mb-8">{questions[currentIdx].text}</h2>

            <div className="flex flex-col gap-4">
                {questions[currentIdx].options.map((opt, i) => {
                    let bgColor = "bg-white";
                    if (selectedOpt === i) {
                        bgColor = i === questions[currentIdx].correct ? "bg-green-100 border-green-500" : "bg-red-100 border-red-500";
                    }

                    return (
                        <button
                            key={i}
                            disabled={selectedOpt !== null}
                            onClick={() => handleAnswer(i)}
                            className={`p-4 border-2 rounded-2xl transition-all ${bgColor} hover:border-blue-400`}
                        >
                            {opt}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}