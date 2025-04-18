import React, { useState } from 'react';
import { CheckCircle2, Pencil, Timer, Trash2, Star } from 'lucide-react';
import { SubtaskProps } from '../types';

function Subtask({ subtask, taskId, boardId, onToggleComplete, editing, startEditing, handleEditSave, onDeleteTask, updateTaskPriority }: SubtaskProps) {
  const isEditing = editing.taskId === taskId && editing.subtaskId === subtask.id;
  // TOOLTIP FUNCTIONALITY COMMENTED OUT (SIMPLIFIED MOBILE LAYOUT)
  // const [showTooltip, setShowTooltip] = useState(false);

  // Show rating as stars
  const renderRating = () => {
    if (!subtask.feedback) return null;
    
    return (
      <div className="flex items-center gap-0.5 text-yellow-400 ml-1" title={`Rating: ${subtask.feedback}/5`}>
        {Array.from({ length: subtask.feedback }).map((_, i) => (
          <Star key={i} className="w-2.5 h-2.5 fill-yellow-400" />
        ))}
      </div>
    );
  };

  return (
    <div className="py-2 px-2 flex flex-col items-start gap-1.5 hover:bg-gray-50/80 backdrop-blur-sm rounded-md transition-colors duration-150 group relative">
      {/* First row: checkbox and task title */}
      <div className="w-full flex items-center gap-3">
        <button
          onClick={() => onToggleComplete(subtask.id, boardId)}
          className={`flex-shrink-0 w-5 h-5 ${
            subtask.completed
              ? 'text-green-500 hover:text-green-600'
              : 'text-gray-300 hover:text-gray-400'
          } transition-colors duration-200`}
        >
          <CheckCircle2 className="w-full h-full" />
        </button>
        
        {isEditing && editing.field === 'title' ? (
          <div className="flex-grow flex items-center min-w-0 z-30 ml-2 bg-white shadow-sm">
            <input
              type="text"
              value={editing.value}
              onChange={(e) => startEditing(taskId, subtask.id, 'title', e.target.value)}
              onBlur={() => handleEditSave(boardId)}
              onKeyDown={(e) => e.key === 'Enter' && handleEditSave(boardId)}
              className="flex-grow py-1 px-2 text-sm rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full"
              autoFocus
            />
          </div>
        ) : (
        <div
          className={`flex-grow text-sm ${ /* Increased font size */
            subtask.completed
              ? 'line-through text-gray-400'
              : 'text-gray-700 hover:text-gray-900'
          } cursor-pointer transition-colors duration-200 mr-1 relative flex items-center`}
          onClick={() => startEditing(taskId, subtask.id, 'title', subtask.title)}
          // TOOLTIP FUNCTIONALITY COMMENTED OUT (SIMPLIFIED MOBILE LAYOUT)
          // onMouseEnter={(e) => {
          //   setShowTooltip(true);
          //   // Position the tooltip near the cursor
          //   setTimeout(() => {
          //     const tooltip = document.querySelector('.subtask-tooltip') as HTMLElement;
          //     if (tooltip) {
          //       tooltip.style.left = `${e.clientX + 10}px`;
          //       tooltip.style.top = `${e.clientY + 10}px`;
          //     }
          //   }, 0);
          // }}
          // onMouseLeave={() => setShowTooltip(false)}
        >
          <span className="mr-1 max-w-full break-words whitespace-normal flex-grow">{subtask.title}</span>
          {subtask.title.length > 40 && (
            <span className="text-sm text-indigo-500 flex-shrink-0 ml-1" title="Click to see full text"> {/* Match text-sm */}
              •••
            </span>
          )}
          {subtask.feedback && renderRating()}
          
          {/* TOOLTIP FUNCTIONALITY COMMENTED OUT (SIMPLIFIED MOBILE LAYOUT) */}
          {/* {showTooltip && (
            <div style={{animation: 'fadeIn 0.15s ease-out forwards', position: 'fixed', zIndex: 1000}} className="subtask-tooltip bg-gray-800 text-white text-sm rounded-md p-3 shadow-xl max-w-xs whitespace-normal break-words pointer-events-none border border-gray-700">
              <div className="font-medium mb-1">Full Text:</div>
              {subtask.title}
            </div>
          )} */}
          </div>
        )}
      </div>
      {/* Second row: time estimate, edit button, delete button - all on one row */}
      <div className="w-full flex items-center mt-2 subtask-actions-row bg-gray-50/50 py-1 px-2 rounded-md">
        {/* Time estimate div */}
        {isEditing && editing.field === 'time' ? (
          <div className="flex items-center gap-1 z-30 bg-white shadow-sm p-1 rounded border border-gray-200 time-edit-container mr-2">
            <Timer className="w-3 h-3 text-gray-500" />
            <input
              type="number"
              value={editing.value}
              onChange={(e) => startEditing(taskId, subtask.id, 'time', e.target.value)}
              onBlur={() => handleEditSave(boardId)}
              onKeyDown={(e) => e.key === 'Enter' && handleEditSave(boardId)}
              className="w-12 py-0.5 px-1.5 text-sm rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 time-input"
              min="0"
              step="0.5"
              autoFocus
            />
            <span className="text-sm text-gray-500">h</span>
          </div>
        ) : (
          <div
            className="flex items-center text-sm text-gray-500 gap-1 px-2 py-1 rounded-full border border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors duration-200 shadow-sm subtask-time-button mr-2"
            onClick={() => startEditing(taskId, subtask.id, 'time', subtask.estimatedTime.toString())}
            title="Click to edit time estimate"
          >
            <Timer className="w-3 h-3" />
            <span className="font-medium">{subtask.estimatedTime}h</span>
          </div>
        )}
        
        {/* Edit button */}
        <button
          className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1.5 rounded hover:bg-gray-100 bg-gray-50 border border-gray-200 shadow-sm mr-2"
          onClick={() => startEditing(taskId, subtask.id, 'title', subtask.title)}
          title="Edit subtask"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        
        {/* Delete button */}
        <button
          onClick={() => onDeleteTask(subtask.id, boardId)}
          className="text-red-400 hover:text-red-600 transition-colors duration-200 p-1.5 rounded hover:bg-red-50 bg-gray-50 border border-gray-200 shadow-sm"
          title="Delete subtask"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default Subtask;