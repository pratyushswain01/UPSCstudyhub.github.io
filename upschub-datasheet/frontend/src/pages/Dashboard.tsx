import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Welcome to UPSChub</h1>

            {/* This link tells the Router to change the page to /quiz */}
            <Link
                to="/quiz"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
                Start Daily Quiz
            </Link>
        </div>
    );
}