import React from 'react';

const ProjectCustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-white border rounded-lg p-3 shadow-md">
        <p className="label font-bold text-black">{`Project: ${label}`}</p>
        <p className="intro text-gray-700">{`Total Visits: ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

export default ProjectCustomTooltip;
