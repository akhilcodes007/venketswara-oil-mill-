import supabase from '../config/supabase.js';

export async function getProductReviews(req, res) {
  const { productId } = req.params;
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;
    res.status(200).json(data || []);
  } catch (error) {
    console.error('[Review] getProductReviews error:', error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
}

export async function submitReview(req, res) {
  const { product_id, rating, comment } = req.body;
  const userId = req.user.id;

  try {
    // Upsert: one review per user per product
    const { data, error } = await supabase
      .from('reviews')
      .upsert(
        {
          user_id: userId,
          product_id,
          rating: parseInt(rating),
          comment: comment?.trim() || null,
        },
        { onConflict: 'user_id,product_id' }
      )
      .select()
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error('[Review] submitReview error:', error);
    res.status(500).json({ message: 'Error saving review' });
  }
}

export async function deleteReview(req, res) {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const { data: review, error: fetchErr } = await supabase
      .from('reviews')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchErr || !review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (req.user.role !== 'admin' && review.user_id !== userId) {
      return res.status(403).json({ message: 'You can only delete your own reviews' });
    }

    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (error) throw error;

    res.status(200).json({ message: 'Review deleted' });
  } catch (error) {
    console.error('[Review] deleteReview error:', error);
    res.status(500).json({ message: 'Error deleting review' });
  }
}
