const ffmpeg = require('fluent-ffmpeg');
const ffprobeStatic = require('ffprobe-static');

// Set the path to the static ffprobe binary
ffmpeg.setFfprobePath(ffprobeStatic.path);

// --- STRICT TYPE CASTING HELPERS ---
// Ensures we always get a valid Number, or returns the fallback (usually 0)
const safeNumber = (val, fallback = 0) => {
    const num = Number(val);
    return (isNaN(num) || !isFinite(num)) ? fallback : num;
};

// Ensures we always get a clean String, preventing nulls or empty blanks
const safeString = (val, fallback = "None") => {
    if (val === undefined || val === null || String(val).trim() === "") {
        return fallback;
    }
    return String(val).trim();
};

// Ensures we always get a strict boolean true/false
const safeBoolean = (val, fallback = false) => {
    if (val === undefined || val === null) return fallback;
    return Boolean(val);
};

const extractVideoMetadata = (filePath) => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) {
                return reject(new Error('Failed to extract metadata: ' + err.message));
            }

            const format = metadata.format || {};
            const videoStream = (metadata.streams || []).find(s => s.codec_type === 'video');
            const audioStream = (metadata.streams || []).find(s => s.codec_type === 'audio');

            if (!videoStream) {
                return reject(new Error('No video stream found in the file.'));
            }

            // 1. Basic Fields (Safe Numbers)
            const width = safeNumber(videoStream.width);
            const height = safeNumber(videoStream.height);
            
            const frame_rate_str = videoStream.r_frame_rate || "0/1";
            let frame_rate = 0;
            if (frame_rate_str.includes('/')) {
                const [num, den] = frame_rate_str.split('/').map(Number);
                frame_rate = den ? (num / den) : 0;
            } else {
                frame_rate = parseFloat(frame_rate_str);
            }
            frame_rate = safeNumber(frame_rate);
            
            const bit_rate = safeNumber(format.bit_rate || videoStream.bit_rate);
            const duration_ms = safeNumber(parseFloat(format.duration) * 1000);
            
            let frame_count = safeNumber(videoStream.nb_frames);
            if (frame_count === 0 && frame_rate > 0 && format.duration) {
                frame_count = Math.round(frame_rate * parseFloat(format.duration));
            }
            frame_count = safeNumber(frame_count);

            const bit_depth = safeNumber(videoStream.bits_per_raw_sample || videoStream.bits_per_sample, 8);
            
            // 2. Math Calculations (Safe Numbers & Booleans)
            const aspect_ratio = height > 0 ? safeNumber(width / height) : 0;
            const pixels = width * height;
            const bitrate_per_pixel = pixels > 0 ? safeNumber(bit_rate / pixels) : 0;
            const bits_per_frame = frame_rate > 0 ? safeNumber(bit_rate / frame_rate) : 0;
            const is_odd_framerate = safeBoolean(frame_rate > 0 && !Number.isInteger(frame_rate));
            
            // 3. Audio Stream (Safe Numbers & Booleans)
            const has_audio = safeBoolean(!!audioStream);
            const audio_bitrate = has_audio ? safeNumber(audioStream.bit_rate) : 0;
            const audio_channels = has_audio ? safeNumber(audioStream.channels) : 0;
            const audio_samplerate = has_audio ? safeNumber(audioStream.sample_rate) : 0;
            
            // 4. Durations (Safe Numbers)
            const v_duration = safeNumber(videoStream.duration || format.duration);
            const a_duration = has_audio ? safeNumber(audioStream.duration || v_duration) : v_duration;
            const av_duration_diff = safeNumber(Math.abs(v_duration - a_duration) * 1000);

            // 5. File Level (Safe Numbers)
            const overall_bitrate = safeNumber(format.bit_rate);
            const file_size = safeNumber(format.size);
            const size_per_second = (format.duration && format.duration > 0) ? safeNumber(file_size / format.duration) : 0;
            
            // 6. Heuristics & Codecs (Safe Strings & Booleans)
            const tags = format.tags || {};
            const encoder = safeString(tags.major_brand || tags.encoder || tags.software).toLowerCase();
            
            let raw_editor_app = "None";
            if (encoder.includes("premiere")) raw_editor_app = "Premiere Pro";
            else if (encoder.includes("davinci")) raw_editor_app = "DaVinci Resolve";
            else if (encoder.includes("capcut")) raw_editor_app = "CapCut";
            else if (encoder.includes("final cut")) raw_editor_app = "Final Cut Pro";

            const known_editor_in_app = safeString(raw_editor_app);
            const known_editor_in_lib = safeString(encoder.includes("lavf") ? "FFmpeg/Lavf" : "None");
            
            const date_mismatch = safeBoolean(!tags.creation_time); 
            
            const codec_name = safeString(videoStream.codec_name).toLowerCase();
            const known_codecs = new Set(["h264", "hevc", "av1", "vp9", "vp8", "mpeg4", "prores"]);
            
            const is_suspicious_codec = safeBoolean(!known_codecs.has(codec_name));
            const is_original_codec = safeBoolean(["h264", "hevc"].includes(codec_name));

            // 7. Final Output (Every field strictly mapped and formatted)
            resolve({
                frame_rate: safeNumber(frame_rate.toFixed(3)),
                bit_rate: Math.round(bit_rate),
                width: Math.round(width),
                height: Math.round(height),
                duration_ms: Math.round(duration_ms),
                frame_count: Math.round(frame_count),
                bit_depth: Math.round(bit_depth),
                resolution_label: safeString(`${width}x${height}`, "0x0"),
                aspect_ratio: safeNumber(aspect_ratio.toFixed(3)),
                bitrate_per_pixel: safeNumber(bitrate_per_pixel.toFixed(4)),
                bits_per_frame: Math.round(bits_per_frame),
                is_odd_framerate: is_odd_framerate,
                audio_bitrate: Math.round(audio_bitrate),
                audio_channels: Math.round(audio_channels),
                audio_samplerate: Math.round(audio_samplerate),
                has_audio: has_audio,
                av_duration_diff: safeNumber(av_duration_diff.toFixed(3)),
                overall_bitrate: Math.round(overall_bitrate),
                size_per_second: Math.round(size_per_second),
                known_editor_in_app: known_editor_in_app,
                known_editor_in_lib: known_editor_in_lib,
                date_mismatch: date_mismatch,
                is_suspicious_codec: is_suspicious_codec,
                is_original_codec: is_original_codec
            });
        });
    });
};

module.exports = { extractVideoMetadata };