"use client";

import { useEffect, useState } from "react";

export default function PanicOverlay() {
    const [isPanicMode, setIsPanicMode] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // ESC key toggles Panic Mode
            if (e.key === "Escape") {
                setIsPanicMode((prev) => !prev);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    if (!isPanicMode) return null;

    return (
        <div className="panic-overlay" onDoubleClick={() => setIsPanicMode(false)}>
            {/* Fake Excel Header */}
            <div className="excel-header">
                <div className="excel-menu-bar">
                    <span className="menu-item active">File</span>
                    <span className="menu-item">Home</span>
                    <span className="menu-item">Insert</span>
                    <span className="menu-item">Page Layout</span>
                    <span className="menu-item">Formulas</span>
                    <span className="menu-item">Data</span>
                </div>
                <div className="excel-toolbar">
                    {/* Mock Toolbar Icons */}
                    <div className="toolbar-icon">💾</div>
                    <div className="toolbar-icon">↩️</div>
                    <div className="toolbar-icon">↪️</div>
                    <div className="toolbar-separator"></div>
                    <div className="font-select">Calibri</div>
                    <div className="font-size">11</div>
                    <div className="toolbar-icon"><b>B</b></div>
                    <div className="toolbar-icon"><i>I</i></div>
                    <div className="toolbar-icon"><u>U</u></div>
                </div>
                <div className="formula-bar">
                    <span className="fx">fx</span>
                    <div className="formula-input"> =SUM(C2:C15)</div>
                </div>
            </div>

            {/* Fake Spreadsheet Grid */}
            <div className="excel-grid">
                {/* Row Header */}
                <div className="grid-row header-row">
                    <div className="cell row-header"></div>
                    <div className="cell col-header">A</div>
                    <div className="cell col-header">B</div>
                    <div className="cell col-header">C</div>
                    <div className="cell col-header">D</div>
                    <div className="cell col-header">E</div>
                    <div className="cell col-header">F</div>
                </div>

                {/* Mock Data Rows */}
                {Array.from({ length: 30 }).map((_, rowIndex) => (
                    <div key={rowIndex} className="grid-row">
                        <div className="cell row-header">{rowIndex + 1}</div>
                        <div className="cell">2024-Q{Math.floor(rowIndex / 4) + 1} Report</div>
                        <div className="cell">{rowIndex % 2 === 0 ? "Expense" : "Revenue"}</div>
                        <div className="cell" style={{ textAlign: "right" }}>
                            {Math.floor(Math.random() * 10000).toLocaleString()}
                        </div>
                        <div className="cell">Completed</div>
                        <div className="cell">{rowIndex % 3 === 0 ? "High" : "Normal"}</div>
                        <div className="cell"></div>
                    </div>
                ))}
            </div>

            <style jsx>{`
        .panic-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: #fff;
          z-index: 9999;
          color: #000;
          font-family: 'Segoe UI', sans-serif;
          font-size: 11px;
          cursor: crosshair;
        }

        .excel-header {
          background: #f3f3f3;
          border-bottom: 1px solid #e1e1e1;
        }

        .excel-menu-bar {
          background: #217346; /* Excel Green */
          color: #fff;
          padding: 8px 12px;
          display: flex;
          gap: 16px;
        }

        .menu-item {
          cursor: pointer;
          opacity: 0.9;
        }
        .menu-item.active {
          font-weight: 600;
          opacity: 1;
          border-bottom: 2px solid #fff;
        }

        .excel-toolbar {
          padding: 8px 12px;
          background: #f3f3f3;
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid #e1e1e1;
        }

        .toolbar-icon {
          padding: 4px;
          cursor: pointer;
          min-width: 24px;
          text-align: center;
          border-radius: 2px;
        }
        .toolbar-icon:hover { background: #d1d1d1; }

        .toolbar-separator {
          width: 1px;
          height: 20px;
          background: #ccc;
          margin: 0 4px;
        }

        .font-select {
          background: #fff;
          border: 1px solid #ccc;
          padding: 2px 6px;
          width: 120px;
        }
        .font-size {
          background: #fff;
          border: 1px solid #ccc;
          padding: 2px 6px;
          width: 40px;
        }

        .formula-bar {
          display: flex;
          align-items: center;
          padding: 6px;
          background: #fff;
          border-bottom: 1px solid #e1e1e1;
        }
        .fx {
          color: #999;
          font-style: italic;
          margin-right: 10px;
          padding-left: 10px;
          font-weight: bold;
        }
        .formula-input {
          flex-grow: 1;
          border: 1px solid #ccc;
          padding: 2px 8px;
          background: #fff;
        }

        .excel-grid {
          background: #fff;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .grid-row {
          display: flex;
        }
        
        .cell {
          border-right: 1px solid #e1e1e1;
          border-bottom: 1px solid #e1e1e1;
          padding: 2px 6px;
          min-width: 100px;
          height: 24px;
          white-space: nowrap;
          overflow: hidden;
          width: 120px;
        }

        .row-header {
          background: #f3f3f3;
          text-align: center;
          color: #666;
          min-width: 40px;
          width: 40px;
          border-right: 1px solid #ccc;
        }

        .col-header {
          background: #f3f3f3;
          text-align: center;
          font-weight: 600;
          color: #666;
          border-bottom: 1px solid #ccc;
        }
      `}</style>
        </div>
    );
}
