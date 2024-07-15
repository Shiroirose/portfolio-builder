import React from 'react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-white border rounded-lg p-2 shadow-md">
        <p className="label font-bold text-black">{`Month: ${label}`}</p>
        <p className="intro text-gray-700">{`Total Visits: ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
