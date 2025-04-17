---
layout: post
title:  "The Biggest Enemy of Generative Modeling"
date:   2025-04-17 18:19:56 +0530
categories: Generative-Modeling
timetoread: 18
---
“Ever heard your grandma talk about generative models?” — WHAT A STUPID QUESTION, RIGHT? Well, as it turns out, **it is not a stupid question**. The idea of generative models can be dated as far back as 1763 when **Thomas Bayes gave the world the “Bayesian Inference”**. However, this explanation only works for those of you who look at generative modeling as a task in Bayesian statistics. For the frequentist approach, the earliest work in generative modeling can be traced back approximately to the 1920s when **Ronald Fisher connected Maximum Likelihood Estimation (MLE) to statistical modeling**. Here, we take both views into account and understand how today’s scientists have successfully evaded the evils of approximating an underlying distribution. Before going ahead, let us finalize some notations for the entire article.

$$
\{x^{n}\}_{n=1}^{N} - \text{Observed data samples}

p_\theta(x) - \text{Arbitrary model family parameterized by }\theta

q_{data}(x) - \text{"True but unknown" data distribution}

p(z|x) - \text{Conditional probabiltiy distribution of z given x}
$$

## But What Is This "Evil"?

In the axioms of probability, the probability distributions must sum up to 1 in order to be valid.

$$
\int{p(x)}dx = 1
$$

The problem of generative modeling, in its most abstract form, is simply a problem of approximating a probability distribution to the true data distribution.

$$
p_\theta(x) \approx q_{data}(x)
$$

However, the probability distribution in question is usually approximated using neural networks (which try to fit flexible functions into the existing data). **These functions are always learned in their unnormalized forms unless defined explicitly (like the `softmax` layer in the transformer paper).** This is where the problem arises — ***to sample from a probability distribution, we need it to be normalized.*** Why?

Sampling essentially means picking out data points from a distribution with the following constraint on the amount of data that can lie in a particular area (A),

$$
p(x\in A) = \int_{A}{p(x)}dx
$$

But when the distribution is unnormalized, sampling takes the following form,

$$
p(x\in A) = \frac{\int_{A}{f(x)}dxA}{\int{f(x)}dx}
$$

where $f(x)$ is the function represented by the neural network (unnormalized function).