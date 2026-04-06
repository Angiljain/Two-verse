import User from '../models/User.js';
import Couple from '../models/Couple.js';
import generateToken from '../utils/generateToken.js';

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({ name, email, password });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      inviteCode: user.inviteCode,
      partnerId: user.partnerId,
      coupleId: user.coupleId,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

export const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      inviteCode: user.inviteCode,
      partnerId: user.partnerId,
      coupleId: user.coupleId,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

export const generateInvite = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.inviteCode = code;
    await user.save();
    res.json({ inviteCode: code });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

export const joinPartner = async (req, res) => {
  const { inviteCode } = req.body;
  
  if (!inviteCode) {
    return res.status(400).json({ message: 'Invite code required' });
  }

  const partner = await User.findOne({ inviteCode });

  if (!partner) {
    return res.status(404).json({ message: 'Invalid invite code' });
  }

  if (partner._id.toString() === req.user._id.toString()) {
    return res.status(400).json({ message: 'Cannot use your own code' });
  }

  if (partner.partnerId) {
    return res.status(400).json({ message: 'Partner is already paired' });
  }

  const user = await User.findById(req.user._id);
  if (user.partnerId) {
    return res.status(400).json({ message: 'You are already paired' });
  }

  const couple = await Couple.create({
    partner1: partner._id,
    partner2: user._id,
  });

  partner.partnerId = user._id;
  partner.coupleId = couple._id;
  partner.inviteCode = null;
  await partner.save();

  user.partnerId = partner._id;
  user.coupleId = couple._id;
  user.inviteCode = null;
  await user.save();

  res.json({ message: 'Successfully paired', coupleId: couple._id, partnerName: partner.name });
};

export const getCoupleInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('partnerId', 'name email inviteCode createdAt');
    if (!user) return res.status(404).json({ message: 'User not found' });

    let coupleStartDate = null;
    if (user.coupleId) {
      const couple = await Couple.findById(user.coupleId);
      coupleStartDate = couple?.startDate || couple?.createdAt || null;
    }

    res.json({
      partner: user.partnerId
        ? {
            _id: user.partnerId._id,
            name: user.partnerId.name,
            email: user.partnerId.email,
            joinedAt: user.partnerId.createdAt,
          }
        : null,
      coupleStartDate,
      coupleId: user.coupleId,
    });
  } catch (err) {
    console.error('getCoupleInfo error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id).populate('partnerId', 'name email');
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      inviteCode: user.inviteCode,
      partner: user.partnerId,
      coupleId: user.coupleId,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};
