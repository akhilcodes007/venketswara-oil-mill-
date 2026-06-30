import supabase from '../config/supabase.js';

export async function getAddresses(req, res) {
  try {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', req.user.id)
      .order('is_default', { ascending: false });

    if (error) throw error;
    res.status(200).json(data || []);
  } catch (error) {
    console.error('[Address] getAddresses error:', error);
    res.status(500).json({ message: 'Error fetching addresses' });
  }
}

export async function addAddress(req, res) {
  const { label, address, landmark, city, state, pincode, phone, is_default } = req.body;
  const userId = req.user.id;

  try {
    // If setting as default, unset all others first
    if (is_default) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', userId);
    }

    const { data, error } = await supabase
      .from('addresses')
      .insert({ user_id: userId, label: label || 'Home', address, landmark, city, state, pincode, phone, is_default: is_default || false })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('[Address] addAddress error:', error);
    res.status(500).json({ message: 'Error adding address' });
  }
}

export async function updateAddress(req, res) {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // Verify ownership
    const { data: existing } = await supabase
      .from('addresses')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!existing || existing.user_id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (req.body.is_default) {
      await supabase.from('addresses').update({ is_default: false }).eq('user_id', userId);
    }

    const { data, error } = await supabase
      .from('addresses')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error('[Address] updateAddress error:', error);
    res.status(500).json({ message: 'Error updating address' });
  }
}

export async function deleteAddress(req, res) {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const { data: existing } = await supabase
      .from('addresses')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!existing || existing.user_id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { error } = await supabase.from('addresses').delete().eq('id', id);
    if (error) throw error;
    res.status(200).json({ message: 'Address deleted' });
  } catch (error) {
    console.error('[Address] deleteAddress error:', error);
    res.status(500).json({ message: 'Error deleting address' });
  }
}

export async function setDefaultAddress(req, res) {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    await supabase.from('addresses').update({ is_default: false }).eq('user_id', userId);
    const { data, error } = await supabase
      .from('addresses')
      .update({ is_default: true })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error || !data) return res.status(404).json({ message: 'Address not found' });
    res.status(200).json(data);
  } catch (error) {
    console.error('[Address] setDefault error:', error);
    res.status(500).json({ message: 'Error setting default address' });
  }
}
