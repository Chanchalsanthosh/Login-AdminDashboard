import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from './firebase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Rectangle } from 'recharts';

const Chart = () => {
  const [chartData, setChartData] = useState([]);
  const [chart2Data, setChart2Data] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ref = collection(firestore, 'analytics');
        const querySnapshot = await getDocs(ref);
        const visitorCountsByDate = {};

        querySnapshot.forEach(doc => {
          const date = doc.id;
          visitorCountsByDate[date] = (visitorCountsByDate[date] || 0) + 1;
        });

        const labels = Object.keys(visitorCountsByDate);
        const counts = Object.values(visitorCountsByDate);

        const data = labels.map((label, index) => ({
          name: label,
          'Visitor Count': counts[index],
        }));

        setChartData(data);

        const ref2 = collection(firestore, 'Incubatees');
        const querySnapshot2 = await getDocs(ref2);
        const incCountsByMonth = {};

        querySnapshot2.forEach(doc => {
          const month = doc.data().month; // corrected to use doc.data()
          incCountsByMonth[month] = (incCountsByMonth[month] || 0) + 1;
        });

        const labels2 = Object.keys(incCountsByMonth);
        const counts2 = Object.values(incCountsByMonth);
        const mmap={1:"Jan",
          2:"Feb",
          3:"Mar",
          4:"April",
          5:"May",
          6:"June",
          7:"July",
          8:"Aug",
          9:"Sept",
          10:"Oct",
          11:"Nov",
          12:"Dec"
        }

        const data2 = labels2.map((label, index) => ({
          name: mmap[label],
          'Incubatee Count': counts2[index],
        }));

        setChart2Data(data2);

      } catch (error) {
        console.error('Error Fetching documents ', error);
        alert('Failed to fetch documents');
      }
    };

    fetchData();
  }, []);

  return (
    <div id='chart'>
      <div className='chart1'>
        <h2>Visitor Count</h2>
        <BarChart
          width={500}
          height={300}
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 80,
            bottom: 5,
          }}
          barSize={20}
        >
          <XAxis
            dataKey="name"
            scale="point"
            padding={{ left: 10, right: 10 }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <CartesianGrid strokeDasharray="3 3" />
          <Bar
            dataKey="Visitor Count"
            fill="#8884d8"
            background={{ fill: "#eee" }}
          />
        </BarChart>
      </div>
      <div className='chart2'>
        <h2>Monthly Incubation</h2>
        <BarChart
          width={500}
          height={300}
          data={chart2Data}
          margin={{
            top: 5,
            right: 30,
            left: 50,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Incubatee Count" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
        </BarChart>
      </div>
    </div>
  );
};

export default Chart;
