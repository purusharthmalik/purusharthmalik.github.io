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
$$
$$
p_\theta(x) - \text{Arbitrary model family parameterized by }\theta
$$
$$
q_{data}(x) - \text{"True but unknown" data distribution}
$$
$$
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

This introduces a **normalization constant** in our equation that is computationally intractable when we have functions that have millions of parameters, since you can not compute it in its closed form. Therefore, **the “evil” here is this intractable integral without which we fail to sample new data points from our underlying distribution.**

Now that we have understood the evil at hand, we will look at all the major classes of generative models and see how exactly they evaded this evil.

## Variational Autoencoders (VAEs)

Problem at hand — **“How can we perform efficient approximate inference and learning with directed probabilistic models whose continuous latent variables and/or parameters have intractable posterior distributions?”** (p.s. this is the first line of the <a href="https://arxiv.org/pdf/1312.6114">VAE paper</a>)

<p>
    <center>
        <img src="{{ site.baseurl }}/assets/vae.png">
        <em>A very basic illustration of an autoencoder (Image taken from this
 <a href="https://hlfshell.ai/posts/representation-engineering/">Kaggle notebook</a>)</em>
    </center>
</p>

The autoencoder model circles around the existence of latent variables — variables that define the inputs but are not directly observed.

$$
p(x, z) = p(z).p(x|z)
$$

Therefore, our goal becomes to model the following marginal likelihood,

$$
p(x) = \int{p(z)p(x|z)dz}
$$

The prior `p(z)` is designed to be tractable (usually a multivariate standard normal distribution). However, this marginal becomes intractable due to the following reasons:

- `p(x|z)` is non-linear (since it is a neural network — decoder).
- `z` usually has a very high dimension.
- there is no closed-form solution to the integral.

**Note — Before coming to `p(x|z)` i.e., the decoder, we have to talk about `p(z|x)`, i.e., the encoder, which faces the same problem of intractability.**

Continuing with our task of avoiding the integral, we use the oldest trick in the book and introduce a variational distribution (i.e., the encoder),

$$
p(x) = \int{\frac{p(x, z)}{q(z|x)}.q(z|x)}
$$

Let us recollect what we know about KL-Divergence,

$$
D_{KL}[q(z|x)||p(z|x)] = \mathbb{E}_{q(z|x)}\[\log{\frac{q(z|x)}{p(z|x)}}\]
$$

Using Bayes’ Rule,

$$
p(z|x) = \frac{p(x, z)}{p(x)}
$$

The earlier equation becomes,

$$
D_{KL}[q(z|x)||p(z|x)] = \mathbb{E}_{q(z|x)}[\log{\frac{q(z|x)}{p(x, z)}} + \log{p(x)}]
$$

Since $p(x)$ is a constant w.r.t $z$, we get,

$$
\log{p(x)} = D_{KL}[q(z|x)||p(z|x)] + \mathbb{E}_{q(z|x)}[\log{\frac{p(x, z)}{q(z|x)}}]
$$

**The expectation part is what we call the lower bound on the marginal likelihood of the observed data.**

Okay, perfect! Now, since KL Divergence is always non-negative, we can drop that from the above equation to formulate the following inequality:

$$
\log{p(x)} \geq \mathbb{E}_{q(z|x)}[\log{p(x|z)}] - D_{KL}[q(z|x)||p(z)]
$$

```The RHS here is known as the Evidence Lower Bound (ELBO). The main objective of a VAE is to maximize ELBO (which doesn’t require any knowledge about p(x) and the KL Divergence is often analytically calculated as the prior distribution is chosen to be a standard normal distribution).```

