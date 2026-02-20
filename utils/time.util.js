const parseTimeToMs = (value) => {
    if (!value || typeof value !== "string") {
        throw new Error("Invalid time format");
    }

    const regex = /^(\d+)(ms|s|m|h|d|y)$/;
    const match = value.trim().toLowerCase().match(regex);

    if (!match) {
        throw new Error(
            "Invalid time format. Use: ms, s, m, h, d, y (e.g. 10m, 7d)"
        );
    }

    const amount = parseInt(match[1]);
    const unit = match[2];

    const multipliers = {
        ms: 1,
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000,
        y: 365 * 24 * 60 * 60 * 1000
    };

    return amount * multipliers[unit];
};

module.exports = parseTimeToMs;