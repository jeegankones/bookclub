import { reactive } from 'vue';

import { supabase } from '../lib/supabase';
import { fetchBooks } from '../utils/fetchBooks';

export const useBookList = reactive({
    bookList: [],
    currentlyReading: null,
    async updateCurrentlyReading() {
        const { data } = await supabase
            .from('winning_books')
            .select(`books(*, profiles(id, full_name))`)
            .order('created_at', { ascending: false })
            .limit(1);
        this.currentlyReading = data[0]?.books;
    },
    async updateBookList() {
        const { data } = await fetchBooks();
        this.bookList = data;
    },
    async updateUserVotes(votes) {
        this.bookList.map((book) => (book.userVoteCount = 0));
        votes.map((vote) => {
            const bookWithVote = this.bookList.find((book) => book.id === vote.book_id);
            if (bookWithVote.userVoteCount) {
                bookWithVote.userVoteCount++;
            } else {
                bookWithVote.userVoteCount = 1;
            }
        });
    },
    async updateVoteCounts() {
        const { data: voteCounts } = await supabase.rpc('count_votes_group_by_book_id');

        this.bookList.forEach((book) => {
            let matchingVoteCount = voteCounts.find((voteCount) => voteCount.book_id === book.id);
            if (matchingVoteCount) {
                book.voteCount = matchingVoteCount.vote_count;
            } else {
                book.voteCount = 0;
            }
        });
    },
});
