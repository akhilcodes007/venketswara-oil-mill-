import supabase from '../config/supabase.js';

export async function getCart(req, res) {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: true });

    if (error) throw error;
    res.status(200).json({ items: data || [] });
  } catch (error) {
    console.error('[Cart] getCart error:', error);
    res.status(500).json({ message: 'Error fetching cart' });
  }
}

export async function saveCart(req, res) {
  const { items } = req.body;
  const userId = req.user.id;

  try {
    // Clear existing cart items
    await supabase.from('cart_items').delete().eq('user_id', userId);

    // Insert all new items
    if (items && items.length > 0) {
      const rows = items.map((item) => ({
        user_id: userId,
        product_id: item.id,
        name: item.name,
        size: item.size,
        price: item.price,
        qty: item.qty,
        image: item.image || null,
      }));

      const { error } = await supabase.from('cart_items').insert(rows);
      if (error) throw error;
    }

    res.status(200).json({ message: 'Cart synced successfully' });
  } catch (error) {
    console.error('[Cart] saveCart error:', error);
    res.status(500).json({ message: 'Error syncing cart' });
  }
}

export async function clearCart(req, res) {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.status(200).json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('[Cart] clearCart error:', error);
    res.status(500).json({ message: 'Error clearing cart' });
  }
}
