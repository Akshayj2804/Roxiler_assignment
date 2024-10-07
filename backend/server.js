const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Product Transaction Schema
const transactionSchema = new mongoose.Schema({
  id: Number,
  title: String,
  price: Number,
  description: String,
  category: String,
  image: String,
  sold: Boolean,
  dateOfSale: Date
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Initialize database route
app.get('/api/initialize-database', async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactions = response.data;
    
    await Transaction.deleteMany({}); // Clear existing data
    await Transaction.insertMany(transactions);
    
    res.json({ message: 'Database initialized successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List transactions route
app.get('/api/transactions', async (req, res) => {
  try {
    const { month, search, page = 1, perPage = 10 } = req.query;
    const monthNumber = new Date(`${month} 1`).getMonth() + 1;
    
    let query = {
      $expr: {
        $eq: [{ $month: '$dateOfSale' }, monthNumber]
      }
    };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { price: isNaN(search) ? undefined : Number(search) }
      ].filter(condition => condition !== undefined);
    }
    
    const totalDocs = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(Number(perPage));
    
    res.json({
      transactions,
      currentPage: Number(page),
      totalPages: Math.ceil(totalDocs / perPage),
      totalItems: totalDocs
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Statistics route
app.get('/api/statistics', async (req, res) => {
  try {
    const { month } = req.query;
    const monthNumber = new Date(`${month} 1`).getMonth() + 1;
    
    const matchStage = {
      $match: {
        $expr: {
          $eq: [{ $month: '$dateOfSale' }, monthNumber]
        }
      }
    };
    
    const stats = await Transaction.aggregate([
      matchStage,
      {
        $group: {
          _id: null,
          totalSaleAmount: { $sum: { $cond: [{ $eq: ['$sold', true] }, '$price', 0] } },
          soldItems: { $sum: { $cond: [{ $eq: ['$sold', true] }, 1, 0] } },
          notSoldItems: { $sum: { $cond: [{ $eq: ['$sold', false] }, 1, 0] } }
        }
      }
    ]);
    
    res.json(stats[0] || { totalSaleAmount: 0, soldItems: 0, notSoldItems: 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bar chart route
app.get('/api/bar-chart', async (req, res) => {
  try {
    const { month } = req.query;
    const monthNumber = new Date(`${month} 1`).getMonth() + 1;
    
    const ranges = [
      { min: 0, max: 100 },
      { min: 101, max: 200 },
      { min: 201, max: 300 },
      { min: 301, max: 400 },
      { min: 401, max: 500 },
      { min: 501, max: 600 },
      { min: 601, max: 700 },
      { min: 701, max: 800 },
      { min: 801, max: 900 },
      { min: 901, max: Infinity }
    ];
    
    const matchStage = {
      $match: {
        $expr: {
          $eq: [{ $month: '$dateOfSale' }, monthNumber]
        }
      }
    };
    
    const rangeData = await Promise.all(ranges.map(async ({ min, max }) => {
      const count = await Transaction.countDocuments({
        ...matchStage.$match,
        price: { $gte: min, $lt: max === Infinity ? Infinity : max + 1 }
      });
      
      return {
        range: max === Infinity ? `${min}-above` : `${min}-${max}`,
        count
      };
    }));
    
    res.json(rangeData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Pie chart route
app.get('/api/pie-chart', async (req, res) => {
  try {
    const { month } = req.query;
    const monthNumber = new Date(`${month} 1`).getMonth() + 1;
    
    const categoryData = await Transaction.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: '$dateOfSale' }, monthNumber]
          }
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json(categoryData.map(item => ({
      category: item._id,
      count: item.count
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Combined data route
app.get('/api/combined-data', async (req, res) => {
  try {
    const { month } = req.query;
    
    const [transactions, statistics, barChart, pieChart] = await Promise.all([
      axios.get(`http://localhost:${PORT}/api/transactions?month=${month}`),
      axios.get(`http://localhost:${PORT}/api/statistics?month=${month}`),
      axios.get(`http://localhost:${PORT}/api/bar-chart?month=${month}`),
      axios.get(`http://localhost:${PORT}/api/pie-chart?month=${month}`)
    ]);
    
    res.json({
      transactions: transactions.data,
      statistics: statistics.data,
      barChart: barChart.data,
      pieChart: pieChart.data
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});