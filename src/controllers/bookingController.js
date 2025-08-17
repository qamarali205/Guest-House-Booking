const Booking = require('../models/Booking.model');
const Guesthouse = require('../models/Guesthouse.model');

/**
 * Check availability: overlapping bookings count (pending/confirmed)
 * Each booking reserves 1 room.
 */
const isAvailable = async (guesthouseId, startDate, endDate) => {
  const overlapping = await Booking.countDocuments({
    guesthouseId,
    status: { $in: ['pending','confirmed'] },
    $or: [
      { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
    ]
  });
  const gh = await Guesthouse.findById(guesthouseId);
  if(!gh) throw new Error('Guesthouse not found');
  return overlapping < gh.rooms;
};

exports.createBooking = async (req,res) => {
  try {
    const { guesthouseId, startDate, endDate } = req.body;
    if(!guesthouseId || !startDate || !endDate) return res.status(400).json({ statusCode:400, message: 'Missing fields' });

    const s = new Date(startDate);
    const e = new Date(endDate);
    if(e <= s) return res.status(400).json({statusCode:400, message: 'endDate must be after startDate' });

    const guesthouse = await Guesthouse.findById(guesthouseId);
    if(!guesthouse) return res.status(404).json({ statusCode:400, message: 'Guesthouse not found' });

    const available = await isAvailable(guesthouseId, s, e);
    if(!available) return res.status(400).json({statusCode:400, message: 'No rooms available for selected dates' });

    const nights = Math.ceil( (e - s) / (1000*60*60*24) );
    const totalAmount = nights * guesthouse.pricePerNight;

    const booking = await Booking.create({
      userId: req.user.id,
      guesthouseId,
      startDate: s,
      endDate: e,
      totalAmount,
      status: 'pending'
    });


     res.status(201).json({
      statusCode: 201,
      message: "start booking process.",
      booking
    });
    
  } catch(err){
    const errorMsg = err.message || "Unknown error";
    res.status(500).send({ statusCode: 500, message: errorMsg });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).populate('guesthouseId');

    if (!bookings || bookings.length === 0) {
      return res.status(200).json({
        statusCode: 200,
        message: "No booking available.",
        bookings: []
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: "Fetch my bookings successfully.",
      bookings
    });
  } catch (err) {
    const errorMsg = err.message || "Unknown error";
    res.status(500).send({
      statusCode: 500,
      message: errorMsg
    });
  }
};


exports.cancelBooking = async (req,res) => {
  try {
    const id = req.params.id;
    const booking = await Booking.findById(id);
    if(!booking) return res.status(404).json({ message: 'Booking not found' });
    if(String(booking.userId) !== String(req.user.id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    if(booking.status === 'cancelled') return res.status(400).json({ message: 'Already cancelled' });
    booking.status = 'cancelled';
    await booking.save();
  
    res.status(200).json({
      statusCode: 200,
      message: "Booking cancelled.",
      booking
    });
  } catch(err){
    const errorMsg = err.message || "Unknown error";
    res.status(500).send({ statusCode: 500, message: errorMsg });
  }
};
