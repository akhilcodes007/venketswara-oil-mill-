import supabase from '../config/supabase.js';

export async function validateCoupon(req, res) {
  const { code } = req.body;

  try {
    const cleanCode = code.trim().toUpperCase();
    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', cleanCode)
      .eq('enabled', true)
      .single();

    if (error || !coupon) {
      return res.status(400).json({ message: 'Invalid or expired coupon code' });
    }

    // Check expiry
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return res.status(400).json({ message: 'This coupon has expired' });
    }

    // Check max uses
    if (coupon.max_uses !== null && coupon.uses >= coupon.max_uses) {
      return res.status(400).json({ message: 'This coupon has reached its usage limit' });
    }

    // Increment usage count
    await supabase
      .from('coupons')
      .update({ uses: coupon.uses + 1 })
      .eq('id', coupon.id);

    res.status(200).json({
      message: `Coupon applied! ${coupon.discount_pct}% off`,
      code: coupon.code,
      discountPct: coupon.discount_pct,
    });
  } catch (error) {
    console.error('[Coupon] validateCoupon error:', error);
    res.status(500).json({ message: 'Error validating coupon' });
  }
}

export async function getCoupons(req, res) {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json(data || []);
  } catch (error) {
    console.error('[Coupon] getCoupons error:', error);
    res.status(500).json({ message: 'Error fetching coupons' });
  }
}

export async function createCoupon(req, res) {
  const { code, discount_pct, max_uses, expires_at } = req.body;

  try {
    const { data, error } = await supabase
      .from('coupons')
      .insert({
        code: code.trim().toUpperCase(),
        discount_pct: parseInt(discount_pct),
        max_uses: max_uses || null,
        expires_at: expires_at || null,
        enabled: true,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ message: 'Coupon code already exists' });
      }
      throw error;
    }
    res.status(201).json(data);
  } catch (error) {
    console.error('[Coupon] createCoupon error:', error);
    res.status(500).json({ message: 'Error creating coupon' });
  }
}

export async function updateCoupon(req, res) {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !data) return res.status(404).json({ message: 'Coupon not found' });
    res.status(200).json(data);
  } catch (error) {
    console.error('[Coupon] updateCoupon error:', error);
    res.status(500).json({ message: 'Error updating coupon' });
  }
}

export async function deleteCoupon(req, res) {
  try {
    const { error } = await supabase.from('coupons').delete().eq('id', req.params.id);
    if (error) throw error;
    res.status(200).json({ message: 'Coupon deleted' });
  } catch (error) {
    console.error('[Coupon] deleteCoupon error:', error);
    res.status(500).json({ message: 'Error deleting coupon' });
  }
}
