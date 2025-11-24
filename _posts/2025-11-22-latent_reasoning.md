---
layout: post
title:  "Is Latent Reasoning The Future?"
date:   2025-11-21 08:19:56 +0530
categories: LLM
timetoread: 20
image: assets/latent1.png
---

**TL;DR — Recent work on Hierarchical and Tiny Recursive Models (HRM/TRM) shows that strong reasoning does not require massive autoregressive LLMs. Instead of forcing every intermediate thought back into discrete tokens — a lossy bottleneck that compounds mistakes — recursive latent-state models refine their internal representations over multiple steps, repairing errors rather than propagating them. Across cognitive science, neuroscience, and modern benchmarks, the evidence points in the same direction: effective reasoning emerges from iterative internal computation, not from scaling next-token prediction indefinitely. HRM and TRM aren’t the final answer, but they mark a meaningful shift — proof that new architectures, inspired as much by biological dynamics as by machine learning tradition, may carry us further than size alone ever will.**

# What Do We Mean By “Latent Reasoning”?

In the LLM landscape, Chain-of-Thought (CoT) prompting is typically regarded as the key to optimizing outputs for reasoning tasks.

**However, language is NOT a tool for reasoning, but merely communication.**

A recent paper from MIT & UC Berkeley discusses this phenomenon at length. Think of a person who does not possess the ability to speak or hear anything. Saying that language is what causes reasoning would equate to saying that this person is physically incapable of performing any reasoning task. However, we have very strong empirical evidences that disprove this line of thought.

<p style="text-align: center;">
    <img src="{{ site.baseurl }}/assets/latent1.png">
    <em>In our brains, language and thought are dissociated. In red are the neurons that fire whenever language comprehension or production is required. However, these neurons do not fire for “thoughts” or reasoning as can be seen in the second and third fMRI images (Image taken from the paper)</em>
</p>

From the study mentioned above, it is abundantly clear that the neurons that are responsible for different forms of reasoning are more often than not dormant when it comes to dealing with language-related tasks.

*We can thus safely assume that a lot of the reasoning in the brain happens in a latent space where not every part of the reasoning process is converted back and forth between the latent space and the space of natural language.*

To simulate the same reasoning in artificial models, one naive way is to simply add more layers (more hidden states = more latent reasoning). However, issues like vanishing gradients strictly restrict this type of infinite growth for improvement in reasoning tasks.

In the human brain, as we will see in the next section, we have an interconnected hierarchy of operations that recursively support reasoning in the latent space till the process of learning is completed.

# A Little Background

The year is 1998, and our understanding of the entorhinal cortex (the part of the brain responsible for processing and relaying memories to the hippocampus) is limited to the fact that waves of different frequencies (including theta and gamma oscillations) are emitted at the same time, with unclear underlying functional purposes.

```Note — In the human brain, theta waves are waves with low frequency ranging from 4Hz — 12Hz, whereas gamma waves have frequencies ranging from 30Hz — 150Hz.```

Then comes the paper “Gamma oscillations in the entorhinal cortex of the freely behaving rat” by The State University of New Jersey. The most notable finding from the paper is that the theta waves don’t just coexist with gamma waves, but CONTROL them.

<p style="text-align: center;">
    <img src="{{ site.baseurl }}/assets/latent2.png">
    <em>A1 and A2 are 400 ms sweeps from a single recording electrode in the second layer of the entorhinal cortex. (Original image is from this paper, labelled by the author)</em>
</p>

This type of interdependency between waves of different frequencies is called Cross-Frequency Coupling (CFC). In the case of the human brain, the specific type of CFC at play is the Phase-Amplitude Coupling (PAC).

Before understanding the coupling, let’s understand the functional significance of the theta and gamma waves.

- **Theta Oscillations:** These waves provide the “overall time window” (better known as a cognitive episode) for a particular memory, i.e., these waves carry the global, temporal information about a single cognitive episode.

- **Gamma Oscillations:** The gamma waves, on the other hand, carry more detailed, local information about a specific “item” in the episode. These waves carry information about which neurons (throughout the brain) were fired for an “item”.

**So, in order to create a complete, coherent memory, the gamma waves convey “WHAT” happened to the hippocampus, whereas the theta waves convey “WHEN” it happened (a complete timeline).**

The coupling of these two waves then results in the phase of the theta wave (which controls the length of the episode) controlling the amplitude of the gamma wave (which reflects the number of neurons that are fired simultaneously).

For the next couple of decades, we knew the functional significance of the theta and gamma waves, but were unclear about the significance of the coupling that was present between the two oscillations.

Then, in late 2009, a new paper titled “Theta–gamma coupling increases during the learning of item–context associations” tried to understand the significance of this coupling with the following experimental setup:

- Environment — Two different environmental contexts contain different stimuli, each with a different reward.

- Objective — In each trial, a rat must learn to differentiate between the two stimuli based on the environmental context.

When learning these context-dependent choices, the theta and gamma activities inside the rat’s brain were recorded. The following are the two findings from this study,

1.  Theta–Gamma CFC in Increases During Learning.

2.  The Strength of CFC Correlates with Mean Performance Accuracy.

<p style="text-align: center;">
    <img src="{{ site.baseurl }}/assets/latent4.png">
    <em>LG stands for Low Gamma. (Image taken from the paper)</em>
</p>

The above figure shows empirical proof of both the findings of the study. As the number of trials increases, the amplitude of the gamma oscillations starts depending more and more on the phase of the theta oscillation at any given moment, i.e., as the performance improves in the association task that was given to the rat, the coupling of the theta and gamma oscillations becomes more apparent.

***Therefore, we establish the role of theta-gamma coupling in associative learning and memory recall.***

# HRM: The Artificial Equivalent To The Theta-Gamma Coupling Phenomenon

HRM, or the Hierarchical Reasoning Model, was the talk of the town when it first came out due to it being a 27M parameter model (compared to ~400 billion parameters in Claude Opus 4) that performed reasonably well on the ARC-AGI-1 leaderboard (32% accuracy; better than Claude Opus 4).

## What Was The Idea?

Inspired by the theta-gamma coupling, the team at Sapient Technologies wanted to create a model that would reason on two different frequencies — one recurrent network that will simulate the theta oscillations and process information on a more abstract and global level, and another recurrent network that will simulate the gamma oscillations and will process local, detailed information in a much faster manner.

<p style="text-align: center;">
    <img src="{{ site.baseurl }}/assets/latent3.png">
    <em>HRM uses the L Module (think of these as gamma waves) to process information on a local level and the H module (think of these as theta waves) to process global information (Image taken from the HRM paper)</em>
</p>

## How Was The Issue Of Early Convergence In RNNs Resolved?

One fatal flaw of the RNN architecture is early convergence — the tendency of an RNN module to converge to a local minima and stop updating its parameters. This issue was resolved in a simple and elegant manner, where the local convergence of the L Module becomes the updated input of the H module, which in turn updates its parameters, and this new information becomes the new context for a completely new L Module. In the paper, they called it the Hierarchical Convergence. This continuous cycle allows the HRM to perform a sequence of N distinct, stable, nested computations (where N is the number of high-level cycles), dramatically multiplying its effective computational depth to N*T steps without succumbing to premature convergence.

This, along with replacing BPTT with a single step backpropagation, resulted in a model that should theoretically reason about even the most complex problems, given enough iterations (which are flexible during inference as there is no pre-training).

## How Well Did It Work?

As we have already discussed, initially, the model made waves in the AI community before the ARC Prize Team published a blog report (https://arcprize.org/blog/hrm-analysis) where they performed ablations on the architecture and found out that this “hierarchical” aspect of the HRM does NOT play a pivotal role in its performance. It was the iterative nature of the model that gave it superpowers, not the hierarchical structure.

## What’s My Take On It?

The Hierarchical Reasoning Model (HRM), while proving highly effective on specialized reasoning benchmarks like Sudoku and complex mazes, highlighted a critical architectural truth. The model’s success demonstrated that the inspiration taken from neuroscience — specifically the Theta-Gamma coupling analogy — is a powerful and necessary avenue for advancing beyond the current limitations of LLMs. Although further analysis found that the performance gains were primarily driven by the iterative refinement loop rather than the H/L hierarchy alone, the HRM remains a potent proof-of-concept. It was theoretically solid and successfully challenged the orthodox thinking of scaling-only architectures, inspiring many researchers to focus on brain-inspired architectures for achieving deeper computational reasoning.

# TRM: Building On The Failures of HRM

Inspired by HRM as well as the later analysis by the ARC Prize Team, a team at Samsung developed a new family of models and named it TRMs: Tiny Recursion Models that proved to be much more efficient than the HRM model, outperforming the “Thinking” mode of Claude Opus 4 on ARC-AGI-1 (getting an accuracy of 40% as opposed to 32% that was achieved by HRM) as well as ARC-AGI-2 **with only 7M parameters.**

<p style="text-align: center;">
    <img src="{{ site.baseurl }}/assets/latent5.png">
    <em>The architecture of TRM as proposed in the paper. The model tries to improve the prediction (y) iteratively, starting from the input (x) using the latent (z). (Diagram taken from the TRM paper)</em>
</p>

The idea behind TRM is to remove the hierarchical structure of HRM and use a single network iteratively to reason about any given problem in the latent space.

## How Does TRM Work?

Let us understand the model through a pseudocode walkthrough from the TRM paper. Starting with the topic of our interest, the latent reasoning that happens inside the TRM model.

<p style="text-align: center;">
    <img src="{{ site.baseurl }}/assets/trm1.png">
    <em>Here, “net” refers to the neural network used in the TRM paper (Image created by the author)</em>
</p>

The model makes 2 forward passes for every iteration,

- The first forward pass improves the latent vector as the input provided to the neural network consists of a concatenated vector that encodes the values of $x$, $y$, and $z$ (previous latent). The output of this pass then becomes the new value of z.
- The second forward pass concatenates only the encoded prediction and the latent vectors, and the output becomes the new value of y.

***So, the intention is clear: in every iteration, first, the reasoning will be updated based on the query and the previous predicted answer. Based on that reasoning, the predicted answer will be updated.***

<p style="text-align: center;">
    <img src="{{ site.baseurl }}/assets/trm2.png">
    <em>Instead of performing backprop on every single forward pass, TRM wants to refine the prediction and reasoning before performing backprop (Image created by the author)</em>
</p>

Now, instead of HRM’s 1-step gradient approximation approach (which assumes that the H module has reached a local equilibrium), TRM updates the values of both the reasoning and the prediction vectors $T-1$ times before calculating the final values that will be used to update the weights of the model. **This deep recursion helps the model approximate the role of the L module in the HRM without the need for a second neural network.**

<p style="text-align: center;">
    <img src="{{ site.baseurl }}/assets/trm4.png">
    <em>Both the “output_head” and the “Q_head” vectors are calculated with the help of a simple MLP (Code taken from the official implementation of the TRM paper)</em>
</p>

After the deep recursion, the prediction (y) of the model is used to calculate two vectors — a (vocab_size, 1) output head vector, and a (2, 1) Q_head vector.

***The output head vector is the intermediate output of the model that will be used to calculate the loss against the ground truth whereas the Q_head vector will be used to calculate an auxiliary loss function and will be used to keep track of the model’s performance with regard to the final answer to see if early stopping is needed or not.***

<p style="text-align: center;">
    <img src="{{ site.baseurl }}/assets/trm3.png">
    <em>y_hat is the predicted output in the token space, and q_hat is the predicted q value, which will be used to figure out the halting or continuation condition (Image created by author)</em>
</p>

So, in the complete loop, TRM performs “deep recursion” followed by loss calculation and parameter updation for N_supervision times per data sample (with a condition for early stopping).

```Note — One small caveat in the pseudocode presented in the paper is that q_hat is not the (2,1) vector generated by the Q_head forward pass but the first index of that vector and is therefore scalar in nature.```

For better generalization, TRM also uses EMA (Exponential Moving Average) of the weights to stabilize the training of the model and to prevent overfitting.

The most significant difference between TRM and HRM is the fact that HRM uses a 1-step gradient approximation (as we have already seen above), whereas TRM performs backpropagation on a full recursion process, i.e., after the $T-1$ refinement steps of $z$ and $y$, the complete BPTT takes place for the $T^{th}$ step.

# Why Are These Results Significant And Why Should You Care?

<p style="text-align: center;">
    <img src="{{ site.baseurl }}/assets/arc-prize-leaderboard.png">
    <em>ARC-AGI-1 Leaderboard as of 22nd November 2025 (Image taken from the official ARC-AGI website)</em>
</p>

In a landscape increasingly dominated by massive, vertically scaled LLMs — systems that smaller “Transformer-ish” models simply cannot match on size alone — HRM and TRM demonstrate something crucial: meaningful alternatives exist. These architectures show that progress doesn’t have to depend on ever-larger models; smarter recursive designs can unlock capabilities that rival or exceed what scale alone can buy. Moreover, in the realm of complex reasoning, they remind us that autoregressive machines are a starting point — not the destination — and that new computational structures may drive the next breakthroughs.

## Autoregressive v/s Latent Reasoning

Before wrapping up our discussion, let’s understand the fundamental difference between autoregressive and latent reasoning. If you were to take one thing away from this article, make it this one:

***Autoregressive reasoning is unforgiving: a single mistake contaminates the context and shapes everything downstream. Latent reasoning is forgiving: missteps can be erased as each recursive step repairs and improves the internal state.***

Autoregressive reasoning is also not optimal in theory, as the model has to convert all its internal thoughts back into discrete vocabulary space before moving to the next step, which incurs an immeasurable information loss. This conversion from a continuous space to a discrete one takes us away from autoregressive techniques for things like reasoning.

The way HRM and TRM have approached latent reasoning might not be the grand answer to solving all complex reasoning problems, but it sure is a start to what will be a highly interesting experiment that will operate in the intersection of the biological and artificial realms and, in my opinion, will eventually give way to performing complex reasoning tasks without heating up the world.

# References

1 — Wang, G., Li, J., Sun, Y., Chen, X., Liu, C., Wu, Y., Lu, M., Song, S., & Abbasi Yadkori, Y. (2025). Hierarchical Reasoning Model. arXiv. https://arXiv.org/pdf/2506.21734

2 — Jolicoeur-Martineau, A. (2025). Less is More: Recursive Reasoning with Tiny Networks. arXiv. https://arxiv.org/pdf/2510.04871

3 — Fedorenko, Evelina; Piantadosi, Steven T.; Gibson, Edward A. F. (2024). Language is primarily a tool for communication rather than thought. Nature, 630(8017), 575–586. doi:10.1038/s41586–024–07522-w.

4 — Tort, A. B. L.; Komorowski, R. W.; Manns, J. R.; Kopell, N. J.; Eichenbaum, H. (2009). Theta–gamma coupling increases during the learning of item–context associations. Proceedings of the National Academy of Sciences of the United States of America, 106(49), 20942–20947. doi:10.1073/pnas.0911331106.

5 — Chrobak, J. J.; Buzsáki, G. (1998). Gamma oscillations in the entorhinal cortex of the freely behaving rat. The Journal of Neuroscience, 18(14), 388–398. [PubMed: 9412515]

6 — ARC Prize Foundation. (2025). ARC-AGI Public Leaderboard. ARC Prize. Retrieved from https://arcprize.org/leaderboard