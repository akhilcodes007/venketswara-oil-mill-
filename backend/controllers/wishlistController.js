import supabase from '../config/supabase.js';

export async function getWishlist(req, res) {
  try {
    const { data, error } = await supabase
      .from('wishlist_items')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json(data || []);
  } catch (error) {
    console.error('[Wishlist] getWishlist error:', error);
    res.status(500).json({ message: 'Error fetching wishlist' });
  }
}

export async function addToWishlist(req, res) {
  const { product_id, size } = req.body;
  const userId = req.user.id;

  try {
    const { data, error } = await supabase
      .from('wishlist_items')
      .upsert({ user_id: userId, product_id, size }, { onConflict: 'user_id,product_id,size' })
      .select()
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error('[Wishlist] addToWishlist error:', error);
    res.status(500).json({ message: 'Error adding to wishlist' });
  }
}

export async function removeFromWishlist(req, res) {
  const { productId, size } = req.params;
  const userId = req.user.id;

  try {
    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('size', size);

    if (error) throw error;
    res.status(200).json({ message: 'Removed from wishlist' });
  } catch (error) {
    console.error('[Wishlist] removeFromWishlist error:', error);
    res.status(500).json({ message: 'Error removing from wishlist' });
  }
}
