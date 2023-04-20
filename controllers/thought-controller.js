const { Thought, User } = require("../models");

const thoughtController = {
    getAllThoughts: async (req, res) => {
        try {
            const thoughts = await Thought.find({}).populate("thoughts").sort({ _id: -1 });
            res.json(thoughts);
        } catch (err) {
            res.status(400).json(err);
        }
    },
    getThoughtById: async ({ params }, res) => {
        try {
            const thought = await Thought.findOne({ _id: params.thoughtId }).populate("thoughts");
            if (!thought) {
                return res.status(404).json({ message: "There is no thought with that ID." });
            }
            res.json(thought);
        } catch (err) {
            res.status(400).json(err);
        }
    },
    addThought: async ({ params, body }, res) => {
        try {
            const thought = await Thought.create(body);
            const user = await User.findOneAndUpdate(
                { _id: body.userId },
                { $push: { thoughts: thought._id } },
                { new: true }
            );
            if (!user) {
                return res.status(404).json({ message: "There is no user with that ID." });
            }
            res.json(user);
        } catch (err) {
            res.json(err);
        }
    },
    updateThought: async ({ params, body }, res) => {
        try {
            const thought = await Thought.findOneAndUpdate({ _id: params.thoughtId }, body, {
                new: true,
                runValidators: true,
            });
            if (!thought) {
                return res.status(404).json({ message: "There is no thought with that ID." });
            }
            res.json(thought);
        } catch (err) {
            res.status(400).json(err);
        }
    },

    removeThought: async ({ params }, res) => {
        try {
            const deletedThought = await Thought.findOneAndDelete({ _id: params.thoughtId });
            if (!deletedThought) {
                return res.status(404).json({ message: "There is no thought with that ID." });
            }
            console.log(deletedThought);
            const user = await User.findOneAndUpdate(
                { username: deletedThought.username },
                { $pull: { thoughts: params.thoughtId } },
                { new: true }
            );
            if (!user) {
                return res.status(404).json({ message: "There is no user with that ID." });
            }
            res.json(user);
        } catch (err) {
            res.json(err);
        }
    },
    addReaction: async ({ params, body }, res) => {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: params.thoughtId },
                { $push: { reactions: body } },
                { new: true, runValidators: true }
            );
            if (!thought) {
                return res.status(404).json({ message: "There is no user with that ID." });
            }
            res.json(thought);
        } catch (err) {
            res.json(err);
        }
    },
    removeReaction: async ({ params }, res) => {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: params.thoughtId },
                { $pull: { reactions: { reactionId: params.reactionId } } },
                { new: true }
            );
            res.json(thought);
        } catch (err) {
            res.json(err);
        }
    },
};

module.exports = thoughtController;
