import { reactive } from 'vue';
import { fetchBooks } from '../utils/fetchBooks';
import { supabase } from '../lib/supabase';

export const useBookList = reactive({
  bookList: [],
  currentlyReading: null,
  async updateCurrentlyReading() {
    const { data } = await supabase
      .from('winning_books')
      .select(`books(*, profiles(full_name))`)
      .order('created_at', { ascending: false })
      .limit(1);
    this.currentlyReading = data[0]?.books;
  },
  async updateBookList() {
    const { data } = await fetchBooks();
    this.bookList = data;
  },
  async updateUserVotes(votes) {
    votes.map((vote) => {
      this.bookList.find((book) => book.id === vote.book_id).vote = true;
    });
    const voteBookIds = votes.map((vote) => vote.book_id);
    this.bookList
      .filter((book) => !voteBookIds.includes(book.id))
      .map((book) => (book.vote = false));
  },
  async updateVoteCounts() {
    const { data: voteCounts } = await supabase.rpc(
      'count_votes_group_by_book_id'
    );

    this.bookList.forEach((book) => {
      let matchingVoteCount = voteCounts.find(
        (voteCount) => voteCount.book_id === book.id
      );
      if (matchingVoteCount) {
        book.voteCount = matchingVoteCount.vote_count;
      } else {
        book.voteCount = 0;
      }
    });
  },
});
