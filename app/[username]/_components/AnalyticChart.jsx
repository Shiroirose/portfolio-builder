import React from "react";
import {AreaChart, CartesianGrid, Tooltip, XAxis, YAxis, Area, ResponsiveContainer } from 'recharts'
import CustomTooltip from "./CustomTooltip"
function AnalyticChart({data}) {

  return (

    <div>
        <ResponsiveContainer width={'100%'} height={100}>
            <AreaChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
                <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
                </defs>
                <XAxis dataKey="month" style={{fontSize:10}} />
                <YAxis style={{fontSize:10}}/>
                {/* <CartesianGrid strokeDasharray="3 3" /> */}
                <Tooltip content={<CustomTooltip/>}/>
                <Area
                type="monotone"
                dataKey="totalClick"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorUv)"
                />
                
            </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AnalyticChart;
